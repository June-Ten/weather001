<!-- 最终结果 -->
<template>
  <div class="title">基于时间序列的天气预测</div>
  <div class="el-form-box">
    <el-form :inline="true" ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item prop="year">
        <el-select size="large" placeholder="年份" v-model="ruleForm.year">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="month">
        <el-select
          size="large"
          placeholder="月份"
          v-model="ruleForm.month"
          @change="monthChange"
        >
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="day">
        <el-select size="large" placeholder="日期" v-model="ruleForm.day">
          <el-option
            v-for="item in dayList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryWeather(ruleFormRef)"
          >预测天气数据</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div class="el-table-box">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="label" label="标签" width="180" />
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup>
import axios from 'axios'
import apis from '@src/apis'
import { reactive, ref } from 'vue'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import moment from 'moment'

let yearList = [
  {
    value: '2021',
    label: '2021',
  },
  {
    value: '2022',
    label: '2022',
  },
]
let monthList = []
let dayList = reactive([])

for (let i = 0; i < 12; i++) {
  monthList.push({
    label: (i + 1).toString(),
    value: i < 9 ? '0' + (i + 1).toString() : (i + 1).toString(),
  })
}
//month select change
const monthChange = (value) => {
  let numberMonth = Number(value)
  let dayTotal = 0
  // 31天的月
  const longDays = [1, 3, 5, 7, 8, 10, 12]
  // 2月 28天
  if (numberMonth === 2) {
    dayTotal = 28
  } else if (longDays.includes(numberMonth)) {
    dayTotal = 31
  } else {
    dayTotal = 30
  }
  dayList.length = 0 //清空数组
  for (let i = 1; i <= dayTotal; i++) {
    let item = {
      label: i.toString(),
      value: i < 10 ? '0' + i.toString() : i.toString(),
    }
    dayList.push(item)
  }
}

const ruleForm = reactive({
  year: '',
  month: '',
  day: '',
})
const ruleFormRef = ref()
// 校验规则
const rules = reactive({
  year: [{ required: true, message: '请选择年份', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  day: [{ required: true, message: '请选择月份', trigger: 'blur' }],
})
// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', ruleForm)
      let params = {
        endDay: ruleForm.year + '-' + ruleForm.month + '-' + ruleForm.day,
      }
      axios.get(apis.tensorflowMaxTemp, { params: params }).then((res) => {
        const { success, data } = res
        if (success) {
          startPredict(data.slice(0, 144))
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
// tableData.forEach((item, index) => {
//   switch (index) {
//     case 0:
//       item.label = '模型预测'
//       break
//     case 1:
//       item.label = '实际结果'
//       break
//     case 2:
//       item.label = '预测评估'
//       break
//     default:
//       break
//   }
// })

// tensorflow.js 部分
const STEP_SIZE = 6
const STEP_NUM = 24
const STEP_OFFSET = 1
const TARGET_SIZE = 7
const LSTM_UNITS = 30

const X_LEN = STEP_SIZE + STEP_OFFSET * (STEP_NUM - 1)
const Y_LEN = TARGET_SIZE

const config = {
  epochs: 30,
  batchSize: 4, // 样本量
}

function buildX(data, stepSize, stepNum, stepOffset) {
  let xData = []
  for (let n = 0; n < stepNum; n += 1) {
    const startIndex = n * stepOffset
    const endIndex = startIndex + stepSize
    const item = data.slice(startIndex, endIndex).map((obj) => obj.value)
    xData.push(item)
  }
  return xData
}

function makeTrainData(data, stepSize, stepNum, stepOffset, targetSize) {
  const trainData = {
    x: [],
    y: [],
  }

  const length = data.length

  const xLength = stepSize + stepOffset * (stepNum - 1)
  const yLength = targetSize
  const stopIndex = length - xLength - yLength

  for (let i = 0; i < stopIndex; i += 1) {
    const x = data.slice(i, i + xLength)
    const y = data.slice(i + xLength + 1, i + xLength + 1 + yLength)

    const xData = buildX(x, stepSize, stepNum, stepOffset)
    const yData = y

    trainData.x.push(xData.map((item) => item))
    trainData.y.push(yData.map((item) => item.value))
  }
  return trainData
}

function buildModel() {
  const model = tf.sequential()

  //lstm input layer
  const hidden1 = tf.layers.lstm({
    units: LSTM_UNITS,
    inputShape: [STEP_NUM, STEP_SIZE],
    returnSequences: true,
  })

  model.add(hidden1)

  //2nd lstm layer
  const output = tf.layers.lstm({
    units: TARGET_SIZE,
    returnSequences: false,
  })

  model.add(output)

  model.add(
    tf.layers.dense({
      units: TARGET_SIZE,
    })
  )

  model.add(
    tf.layers.activation({
      activation: 'tanh',
    })
  )

  //compile
  const rmsprop = tf.train.rmsprop(0.005)
  model.compile({
    optimizer: rmsprop,
    loss: tf.losses.meanSquaredError,
  })

  return model
}

async function predict(model, input) {
  const prediction = await model.predict(tf.tensor([input])).data()
  return prediction
}

async function trainBatch(data, model) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc']
  const container = {
    name: 'show.fitCallbacks',
    tab: 'Training',
    drawArea: document.getElementById('tensorflow-container'),
  }
  // 过程不显示 可视化
  const opts = {
    callbacks: [],
  }

  // const callbacks = tfvis.show.fitCallbacks(container, metrics)
  // 过程 不显示 可视化
  const callbacks = tfvis.show.fitCallbacks(container, metrics, opts)

  console.log('training start!')
  const epochs = config.epochs
  const results = []
  const xs = tf.tensor3d(data.x)
  const ys = tf.tensor2d(data.y)

  const history = await model.fit(xs, ys, {
    batchSize: config.batchSize,
    epochs: config.epochs,
    validationSplit: 0.2,
    callbacks: [
      callbacks,
      {
        onEpochEnd: (epoch, log) => {
          // display loss
          console.log(epoch, log.loss)
        },
      },
    ],
  })

  console.log('training complete!')
  return history
}

async function startPredict(rawData) {
  rawData.forEach((item) => {
    item.Number = String(Number(item.Number) + 100)
  })
  const airPassagnerData = rawData

  console.log('获取的原始数据', airPassagnerData)

  // Normalize data with value change
  let changeData = []

  for (let i = 1; i < airPassagnerData.length; i++) {
    const item = {}
    item.date = airPassagnerData[i].Date
    const val = parseInt(airPassagnerData[i].Number)
    const val0 = parseInt(airPassagnerData[i - 1].Number)
    item.value = val / val0 - 1 // 观察走势
    changeData.push(item)
  }

  console.log('标准化数据', changeData)

  const trainData = makeTrainData(
    changeData,
    STEP_SIZE,
    STEP_NUM,
    STEP_OFFSET,
    TARGET_SIZE
  )

  const model = buildModel()
  model.summary()

  const history = await trainBatch(trainData, model)

  const inputStart = changeData.length - X_LEN
  const inputEnd = changeData.length
  const input = changeData.slice(inputStart, inputEnd)
  const predictInput = buildX(input, STEP_SIZE, STEP_NUM, STEP_OFFSET)
  const prediction = await predict(model, predictInput)

  // re-constructe predicted value based on change
  const base = airPassagnerData[airPassagnerData.length - 1]
  const baseDate = moment(new Date(base.Date))
  const baseValue = parseInt(base.Number)

  let predictionValue = []
  let val = baseValue
  for (let i = 0; i < prediction.length; i += 1) {
    const item = {}
    const date = baseDate.add(1, 'day')
    item.time = moment(date).format('YYYY-MM-DD')
    item.value = val + val * prediction[i] // -100
    item.isPrediction = 'Yes'
    predictionValue.push(item)
    val = item.value
  }

  console.log(predictionValue)
  let airPassagnerDataWithPrediction = []
  predictionValue.forEach((item) => {
    airPassagnerDataWithPrediction.push(item)
  })
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 20px;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
}
.el-form-box {
  margin-top: 20px;
}
</style>
