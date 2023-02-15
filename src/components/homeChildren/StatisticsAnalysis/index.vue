<!-- 天气状况统计分析 -->
<template>
  <HeaderSelector></HeaderSelector>
  <div class="pieAndBar-box">
    <div class="first-box" style="display: flex;">
      <div class="pie" v-if="statAnalStore.pieData.success">
        <Pie></Pie>
      </div>
      <div class="bar" v-if="statAnalStore.windBarData.success">
        <WindBar></WindBar>
      </div>
    </div>

    <div class="second-box" style="margin-top: 100px;display: flex;">
      <div class="sunny">
        <!-- 每月的晴天统计 -->
        <MonthlySunnyStatistics
          v-if="statAnalStore.sunnyDayData.success"
        ></MonthlySunnyStatistics>
      </div>
      
      <div class="aqi-box">
          <AQI v-if="statAnalStore.aqiData.success"></AQI>
        </div>
    </div>
  </div>
</template>

<script setup>
import HeaderSelector from './HeaderSelect.vue'
import Pie from './Pie.vue'
import WindBar from './WindBar.vue'
import MonthlySunnyStatistics from './MonthlySunnyStatistics.vue'
import AQI from './AQI.vue'
import { useStatAnalStore } from '@src/store/statisticsAnalysis.js'

const statAnalStore = useStatAnalStore()

// // 节流函数
// const throttle = (fn, delay = 200) => {
//   let timer
//   return function () {
//     if (timer) {
//       return
//     }
//     timer = setTimeout(() => {
//       fn.apply(this, arguments)
//       timer = true // timer = null是传统写法,这里是只想运行一次
//     }, delay)
//   }
// }
// // 防抖
// const debounce = (fn, delay = 200) => {
//   let timer
//   return function () {
//     if (timer) {
//       clearTimeout(timer)
//     }
//     timer = setTimeout(() => {
//       fn.call(this)
//     }, delay)
//   }
// }
// window.onscroll = debounce(function () {
//   if (!visible.value) {
//     visible.value = true
//   }
// }, 400)
</script>

<style lang="less" scoped>
.pieAndBar-box {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  width: 100%;
  height: 500px;
  .pie {
    width: 500px;
    height: 500px;
  }
  .bar {
    width: 500px;
    height: 500px;
  }
  .sunny {
    width: 600px;
    height: 500px;
  }
  .aqi-box {
    width: 500px;
    height: 500px;
  }
}
</style>
