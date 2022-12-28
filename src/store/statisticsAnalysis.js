import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apis from '../apis'

// 天气状况统计
export const useStatAnalStore = defineStore('statAnal', () => {
  let pieData = ref([])
  let windBarData = ref([])
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
  }
  return {
    pieData,
    windBarData,
    getStatAnal,
  }
})
