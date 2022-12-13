<template>
  <el-table
    :data="
      weatherQueryStore.tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    "
    style="width: 100%"
  >
    <el-table-column prop="date" label="日期" min-width="20%" />
    <el-table-column prop="week" label="星期" min-width="16%" />
    <el-table-column prop="maxTemp" label="最高温度℃" min-width="16%" />
    <el-table-column prop="minTemp" label="最低温度℃" min-width="16%" />
    <el-table-column prop="weather" label="天气" min-width="16%" />
    <el-table-column prop="windDirection" label="风向" min-width="16%" />
  </el-table>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="weatherQueryStore.tableData.length"
    :page-size="pageSize"
    @current-change="handleCurrentChange"
    style="display: flex; justify-content: right; margin-top: 10px"
  />
</template>

<script setup>
import { ref } from 'vue'
import {useQueryTableData} from '@src/store/weatherQueryTableData.js'

const weatherQueryStore = useQueryTableData()

let currentPage = ref(1)
let pageSize = ref(10)

const handleCurrentChange = (currentPageArg) => {
  console.log('currentPage', currentPageArg)
  currentPage.value = currentPageArg
}
</script>
