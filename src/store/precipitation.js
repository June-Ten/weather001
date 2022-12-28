import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apis from '../apis'

// 全国降水量
export const usePrecipitationStore = defineStore('precipitationStore', () => {
  let precipitationData = ref([]) // 降水量
  function getPrecipitationData(params) {
    precipitationData.value = []
    axios.get(apis.waterNumber,{
      params:params,
    }).then((res) => {
      console.log('全国降水量',res)
      precipitationData.value = res
    })
  }
  return {
    getPrecipitationData,
    precipitationData,
  }
})
