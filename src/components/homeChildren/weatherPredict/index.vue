<!-- 天气预测 -->
<template>
  <div>
    <HeadSelect :rawData="rawData" @changeData="getRawData"></HeadSelect>
    <Table :tableDataSource="tableDataSource" v-if="tableDataSource.length >= 2"></Table>
    <el-button @click="myPredict">开始预测</el-button>
    <div class="iframe-box" style="width: 100%; height: 1000px;">
      <iframe
        src="../predictWeather/index.html"
        frameborder="0"
        ref="myRef"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import HeadSelect from './HeadSelect.vue'
import Table from './Table.vue'
import { onMounted, ref, reactive } from 'vue'

let realWeatherData = {
  // 原始数据
  maxNumber: 0, // 最高温度
  minNumber: 0, // 最低温度
  rawDate: '', // 日期
  aqiNumber: 0, // aqi指数
  aqiLevel: '', // aqi等级
}

let predictWeatherData = {
  // 预测数据
  maxNumber: 0, // 最高温度
  minNumber: 0, // 最低温度
  aqiNumber: 0, // aqi指数
  aqiLevel: '', // aqi等级
}

onMounted(() => {
  // myRef.value.contentWindow.postMessage('mounted',"*")
  window.addEventListener('message', (e) => {
    console.log('iframe发送给vue的数据', e.data)
    if (e?.data?.index === 1) {
      // 预测的最高温度
      predictWeatherData.maxNumber = parseInt(e.data[0].value)
      // 开始预测最低温度
      let newData = rawData.map((item) => {
        return {
          Date: item.Date,
          Number: item.minNumber,
        }
      })
      myRef.value.contentWindow.postMessage(newData)
    }
    if (e?.data?.index === 2) {
      // 预测的最低温度
      predictWeatherData.minNumber = parseInt(e.data[0].value)
      // 开始预测aqi
      let tempData = rawAqiData.map((item) => {
        let newItem = {
          Date: item.Date,
          Number: item.aqiNumber,
        }
        return newItem
      })
      // console.log('aqi最后', tempData)
      myRef.value.contentWindow.postMessage(tempData)
      
    }
    if (e?.data?.index === 3) {
      // 预测的aqi
      predictWeatherData.aqiNumber = parseInt(e.data[0].value)
      predictWeatherData.aqiLevel = judgmentAqiLevel(predictWeatherData.aqiNumber)
      console.log('预测完之后',predictWeatherData)
      // 预测完之后
      tableDataSource.push({
        date: realWeatherData.rawDate,
        maxTemp: predictWeatherData.maxNumber,
        minTemp: predictWeatherData.minNumber,
        aqiLevel: predictWeatherData.aqiLevel,
        aqiNumber: predictWeatherData.aqiNumber
      })
      // 原始数据
      tableDataSource.push({
        date: realWeatherData.rawDate,
        maxTemp: realWeatherData.maxNumber,
        minTemp: realWeatherData.minNumber,
        aqiLevel: realWeatherData.aqiLevel,
        aqiNumber: realWeatherData.aqiNumber
      })
      tableDataSource.forEach((item, index) => {
        switch (index) {
          case 0:
            item.label = '模型预测'
            break
          case 1:
            item.label = '实际结果'
            break
          case 2:
            item.label = '预测评估'
            break
          default:
            break
        }
      })
    }
  })
})

let rawAqiData = reactive([]) // 查询的原始aqi数据
let rawData = reactive([]) // 查询的原始气温数据
const getRawData = (value,aqiData) => {
  // handle select传过来的
  value.map((item) => {
    rawData.push(item)
  })
  aqiData.map((item) => {
    rawAqiData.push(item)
  })
}

const myRef = ref(null)
// myRef.value.contentWindow.postMessage()

const myPredict = () => {
  let newData = rawData.map((item) => {
    return {
      Date: item.Date,
      Number: item.maxNumber,
    }
  })
  newData.pop() // 原始数据气温
  let tempRawData = rawData.at(-1)
  realWeatherData.maxNumber = parseInt(tempRawData.maxNumber)
  realWeatherData.minNumber = parseInt(tempRawData.minNumber)
  realWeatherData.rawDate = tempRawData.Date
  let tempReal =rawAqiData.pop() 
  realWeatherData.aqiNumber = tempReal.aqiNumber
  realWeatherData.aqiLevel = judgmentAqiLevel(Number(realWeatherData.aqiNumber))
  console.log('原始数据',realWeatherData,tempRawData,rawAqiData)
  myRef.value.contentWindow.postMessage(newData)
}

// 判断等级
const judgmentAqiLevel = (aqiNumber) => {
  if (aqiNumber >=0 && aqiNumber <=50) {
    return '优'
  }
  if (aqiNumber >=51 && aqiNumber <=100) {
    return '良'
  }
  if (aqiNumber >=101 && aqiNumber <=150) {
    return '轻度污染'
  }
  if (aqiNumber >=151 && aqiNumber <=200) {
    return '中度污染'
  }
  if (aqiNumber >=201 && aqiNumber <=300) {
    return '重度污染'
  }
  if (aqiNumber >=301 && aqiNumber <=500) {
    return '严重污染'
  }
}

let tableDataSource = reactive([]) // table data
</script>

<style lang="less" scoped></style>
