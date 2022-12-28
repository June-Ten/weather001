import {defineStore} from 'pinia'
import {ref} from 'vue'
import axios from 'axios'
import apis from '../apis'

// 查询天气表格
export const useQueryTableData = defineStore('weatherTableData',()=> {
  let tableData = ref([])
  function getTableData(params) {
    console.log('storeParams',params);
    axios.post(apis.weatherQuery,params).then((res)=> {
      tableData.value = res.data
    })
  }
  return {
    tableData,
    getTableData,
  }
})