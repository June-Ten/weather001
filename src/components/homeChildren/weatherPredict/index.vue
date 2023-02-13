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
}

let predictWeatherData = {
  // 预测数据
  maxNumber: 0, // 最高温度
  minNumber: 0, // 最低温度
}

onMounted(() => {
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
      console.log('预测完之后',predictWeatherData)
      // 预测完之后
      tableDataSource.push({
        date: realWeatherData.rawDate,
        maxTemp: predictWeatherData.maxNumber,
        minTemp: predictWeatherData.minNumber,
      })
      // 原始数据
      tableDataSource.push({
        date: realWeatherData.rawDate,
        maxTemp: realWeatherData.maxNumber,
        minTemp: realWeatherData.minNumber,
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

let rawData = reactive([]) // 查询的原始数据
const getRawData = (value) => {
  // handle select传过来的
  value.map((item) => {
    rawData.push(item)
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
  console.log('原始数据',realWeatherData,tempRawData)
  myRef.value.contentWindow.postMessage(newData)
}

let tableDataSource = reactive([]) // table data
</script>

<style lang="less" scoped></style>
