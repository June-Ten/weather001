// 天气预测 store
import { defineStore } from 'pinia'
import { reactive } from 'vue'

// 气温预测
export const usePredictTemp = defineStore('predictTemp', () => {
  let tableData = reactive([])
  function getTableData(rawDate,rawMaxTemp,rawMinTemp,predictMaxTemp,predictMinTemp) {
    // 预测
    tableData.push({
      date:rawDate,
      maxTemp: predictMaxTemp,
      minTemp: predictMinTemp,
    })
    // 真实
    tableData.push({
      date: rawDate,
      maxTemp: rawMaxTemp,
      minTemp: rawMinTemp,
    })
    tableData.forEach((item, index) => {
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
  return {
    tableData,
    getTableData,
  }
})
