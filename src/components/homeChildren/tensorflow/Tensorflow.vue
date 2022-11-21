<template>
  <div class="button-box">
    <el-button @click="mypredict">预测</el-button>
  </div>
  <div class="show-info">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="always">最高气温预测值:</el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">{{maxTemp ? maxTemp : '正在预测中...'}}</el-card>
        </el-col>
      </el-row>
  </div>
  <div id="tensorflow-container" style="width: 100%; height: 600px"></div>
</template>

<script setup>
import { ref } from "vue";
import * as d3 from "d3";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import moment from "moment";
import apis from "@src/apis";
import axios from "axios";

function test() {
  // 利用滑动时间窗口的方法来构建训练数据,用到了以下参数

  // 数据窗口的大小,6表示每一个数据包含3个值
  //  数据input维度就是3 步长 时间序列的长度
  const STEP_SIZE = 6;
  // 一共要走多少步,Time维度就是24
  // 6 * 24 = 144 数据的总长度
  const STEP_NUM = 5;
  // 时间窗口向前移动的时候,每次走多少个时间单位,这里每次走一步
  const STEP_OFFSET = 1;
  // 要预测的时间长度,这里表示24个月
  const TARGET_SIZE = 7;
  const LSTM_UNITS = 30;

  const X_LEN = STEP_SIZE + STEP_OFFSET * (STEP_NUM - 1);
  const Y_LEN = TARGET_SIZE;

  const config = { epochs: 30, batchSize: 4 };

  async function loadData(path) {
    return await d3.csv(path);
  }

  // LSTM模型需要一个三维数据的输入
  // 分别对应Batch（数据是一批一批进入神经网络训练
  // Input是输入数据的size和Timestep，时间。
  function buildX(data, stepSize, stepNum, stepOffset) {
    let xData = [];
    for (let n = 0; n < stepNum; n += 1) {
      const startIndex = n * stepOffset;
      const endIndex = startIndex + stepSize;
      const item = data.slice(startIndex, endIndex).map((obj) => obj.value);
      xData.push(item);
    }
    return xData;
  }

  // 制造训练数据集
  function makeTrainData(data, stepSize, stepNum, stepOffset, targetSize) {
    const trainData = { x: [], y: [] };

    const length = data.length;

    const xLength = stepSize + stepOffset * (stepNum - 1);
    const yLength = targetSize;
    const stopIndex = length - xLength - yLength;

    for (let i = 0; i < stopIndex; i += 1) {
      const x = data.slice(i, i + xLength);
      const y = data.slice(i + xLength + 1, i + xLength + 1 + yLength);

      const xData = buildX(x, stepSize, stepNum, stepOffset);
      const yData = y;

      trainData.x.push(xData.map((item) => item));
      trainData.y.push(yData.map((item) => item.value));
    }
    return trainData;
  }

  // 创建模型
  function buildModel() {
    const model = tf.sequential();

    //lstm input layer 输入层
    const hidden1 = tf.layers.lstm({
      units: LSTM_UNITS,
      inputShape: [STEP_NUM, STEP_SIZE],
      returnSequences: true,
    });

    model.add(hidden1);

    //2nd lstm layer 输出层
    const output = tf.layers.lstm({
      units: TARGET_SIZE,
      returnSequences: false,
    });

    model.add(output);

    model.add(
      tf.layers.dense({
        units: TARGET_SIZE,
      })
    );

    model.add(tf.layers.activation({ activation: "tanh" }));

    //compile
    const rmsprop = tf.train.rmsprop(0.005);
    model.compile({
      optimizer: rmsprop,
      loss: tf.losses.meanSquaredError,
    });

    return model;
  }

  async function predict(model, input) {
    const prediction = await model.predict(tf.tensor([input])).data();
    return prediction;
  }

  async function trainBatch(data, model) {
    const metrics = ["loss", "val_loss", "acc", "val_acc"];
    const container = {
      name: "show.fitCallbacks",
      tab: "Training",
      drawArea: document.getElementById("tensorflow-container"),
      // styles: {
      //   height: "1000px",
      // },
    };

    const callbacks = tfvis.show.fitCallbacks(container, metrics);

    console.log("training start!");
    // tfvis.visor();
    // Save the model
    // const saveResults = await model.save('downloads://air-time-model');
    const epochs = config.epochs;
    const results = [];
    const xs = tf.tensor3d(data.x);
    const ys = tf.tensor2d(data.y);

    const history = await model.fit(xs, ys, {
      batchSize: config.batchSize,
      epochs: config.epochs,
      validationSplit: 0.2,
      callbacks: callbacks,
    });

    console.log("training complete!");
    return history;
  }

  (async function () {
    // const airPassagnerData = await loadData(
    //   "https://cdn.jsdelivr.net/gh/gangtao/datasets@master/csv/air_passengers.csv"
    // );
    let tempData = await axios.get(apis.tensorflow);
    tempData.data.forEach((item) => {
      item.Number = String(item.Number);
    });
    const airPassagnerData = tempData.data;
    airPassagnerData.columns = ["Date", "Number"];
    console.log("获取过来的数据", airPassagnerData);

    // Normalize data with value change
    // 标准化数据 -1~1
    let changeData = [];
    airPassagnerData.splice(30);
    console.log("截取的数据", airPassagnerData);
    for (let i = 1; i < airPassagnerData.length; i++) {
      const item = {};
      item.date = airPassagnerData[i].Date;
      const val = parseInt(airPassagnerData[i].Number);
      const val0 = parseInt(airPassagnerData[i - 1].Number);
      if (val0 != 0) {
        item.value = val / val0 - 1;
      } else {
        item.value = val / (val0 + 1) - 1;
      }
      changeData.push(item);
    }
    console.log("标准化后的数据", changeData);

    const trainData = makeTrainData(
      changeData,
      STEP_SIZE,
      STEP_NUM,
      STEP_OFFSET,
      TARGET_SIZE
    );

    const model = buildModel();
    model.summary();

    const history = await trainBatch(trainData, model);

    const inputStart = changeData.length - X_LEN;
    const inputEnd = changeData.length;
    const input = changeData.slice(inputStart, inputEnd);
    const predictInput = buildX(input, STEP_SIZE, STEP_NUM, STEP_OFFSET);
    const prediction = await predict(model, predictInput);
    console.log("预测的初始数据", prediction);

    // re-constructe predicted value based on change
    // 把标准的值还原成实际的值
    const base = airPassagnerData[airPassagnerData.length - 1];
    const baseDate = moment(new Date(base.Date));
    const baseValue = parseInt(base.Number);

    let predictionValue = [];
    let val = baseValue;
    for (let i = 0; i < prediction.length; i += 1) {
      const item = {};
      const date = baseDate.add(1, "day");
      item.time = moment(date).format("YYYY-MM-DD");
      item.value = val + val * prediction[i];
      item.isPrediction = "Yes";
      predictionValue.push(item);
      val = item.value;
    }

    console.log("预测转换后的数据", predictionValue);
    maxTemp.value = Math.floor(predictionValue[0].value);
  })();
}

let maxTemp = ref();
const mypredict = () => {
  maxTemp.value = test();
};
</script>

<style lang="less" scoped>
.button-box {
  display: flex;
  align-items: center;
}
.show-info {
  margin-top: 10px;
}
</style>
