<!-- 天气查询 -->
<template>
  <div class="title">基于时间序列的天气预测</div>
  <div class="el-form-box">
    <el-form :inline="true" ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item prop="province">
        <el-select
          @change="onChange"
          v-model="ruleForm.province"
          placeholder="省份"
          size="large"
        >
          <el-option
            v-for="item in provinceAndCityData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="city">
        <el-select v-model="ruleForm.city" placeholder="城市" size="large">
          <el-option
            v-for="item in cityList"
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
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <el-progress
    type="circle"
    :percentage="percentage"
    :status="status"
    v-if="progressVisible"
  />
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { usePredictTemp } from '@src/store/predictTemp.js'
import { provinceAndCityData, CodeToText } from 'element-china-area-data'
import axios from 'axios'
import apis from '@src/apis'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import moment from 'moment'

const predictTempStore = usePredictTemp()

// 省份,城市
let province = ref('')
let city = ref('')
let cityList = ref()
const onChange = (value) => {
  city.value = ''
  let tempIndex = provinceAndCityData.findIndex((item) => {
    return value === item.value
  })
  cityList.value = provinceAndCityData[tempIndex].children
}

// 月份
const monthList = [
  {
    label: '1',
    value: '01',
  },
  {
    label: '2',
    value: '02',
  },
  {
    label: '3',
    value: '03',
  },
  {
    label: '4',
    value: '04',
  },
  {
    label: '5',
    value: '05',
  },
  {
    label: '6',
    value: '06',
  },
  {
    label: '7',
    value: '07',
  },
  {
    label: '8',
    value: '08',
  },
  {
    label: '9',
    value: '09',
  },
  {
    label: '10',
    value: '10',
  },
  {
    label: '11',
    value: '11',
  },
  {
    label: '12',
    value: '12',
  },
]
let dayList = reactive([])
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
  province,
  city,
  month: '',
  day: '',
})
const ruleFormRef = ref()
// 校验规则
const rules = reactive({
  province: [{ required: true, message: '请选择省份', trigger: 'blur' }],
  city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  day: [{ required: true, message: '请选择日期', trigger: 'blur' }],
})


let rawData = ref([])
let rawDate = ref('') // 预测的日期
let rawMaxTemp = ref(0) // 真实最高气温
let rawMinTemp = ref(0) // 真实最低气温
let predictMaxTemp = ref(0) // 预测最高气温
let predictMinTemp = ref(0) // 预测最低气温
// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        city: CodeToText[ruleForm.city],
        endDay: '2021-' + ruleForm.month + '-' + ruleForm.day,
      }
      axios.get(apis.predictTemp, { params: params }).then((res) => {
        console.log('获取来的原始气温数据', res)
        const { success = false, data } = res
        if (success) {
          rawData.value = data
          rawMaxTemp.value = Number(data.at(-1)['maxNumber'])
          rawMinTemp.value = Number(data.at(-1)['minNumber'])
          rawDate.value = data.at(-1)['Date']
          let maxList = [] // 最高温度
          data.slice(0, 144).forEach((item) => {
            maxList.push({
              Date: item['Date'],
              Number: item['maxNumber'],
            })
          })
          maxList.columns = ['Date', 'Number']
          let minList = [] // 最低温度
          data.slice(0, 144).forEach((item) => {
            minList.push({
              Date: item['Date'],
              Number: item['minNumber'],
            })
          })
          maxList.columns = ['Date', 'Number']
          startPredict(maxList).then((res) => {
            console.log('预测最高气温', res)
            predictMaxTemp.value = parseInt(res[0].value)
            startPredict(minList).then((res) => {
              console.log('预测最低气温', res)
              predictMinTemp.value = parseInt(res[0].value)
              predictTempStore.getTableData(
                rawDate.value,
                rawMaxTemp.value,
                rawMinTemp.value,
                predictMaxTemp.value,
                predictMinTemp.value,
                predictMinTemp.value,
                predictMaxTemp.value
              )
            })
          })
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// el-progress
let percentageCount = ref(0)
let percentage = ref(0)
let status = ref('')
let progressVisible = ref(false)

// tensorflow.js 预测部分
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
  tfvis.visor().close() // 不显示遮阳板
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
          percentageCount.value++
          percentage.value = parseInt((percentageCount.value / 60) * 100)
          progressVisible.value = true
          if (percentageCount.value === 60) {
            status.value = 'success'
            setTimeout(() => {
              progressVisible.value = false
            }, 3000)
          }
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
    item.value = val + val * prediction[i]-100 // -100
    item.isPrediction = 'Yes'
    predictionValue.push(item)
    val = item.value
  }

  return predictionValue
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
