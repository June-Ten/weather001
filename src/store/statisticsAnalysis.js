import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apis from '../apis'

// 天气状况统计
export const useStatAnalStore = defineStore('statAnal', () => {
  let pieData = ref([]) // 饼图数据
  let windBarData = ref([]) // 柱状图数据
  let sunnyDayData = ref([]) // 每月的晴天数据
  let aqiData = ref([]) // aqi指数
  function getStatAnal(params) {
    console.log('sotreParams:', params)
    pieData.value = []
    windBarData.value = []
    axios.get(apis.weatherTypeStat, { params: params }).then((res) => {
      pieData.value = res
    })
    axios.get(apis.windStat, { params: params }).then((res) => {
      console.log('windResponse:', res)
      windBarData.value = res
    })
    axios.get(apis.monthlySunnyDay,{ params: params }).then((res) => {
        sunnyDayData.value = res
    })
    axios.get(apis.aqiStat,{ params: params }).then((res) => {
      aqiData.value = res
  })
  }
  return {
    pieData,
    windBarData,
    sunnyDayData,
    aqiData,
    getStatAnal,
  }
})
