<template>
  <el-table :data="predictTempStore.tableData" stripe style="width: 100%">
    <el-table-column prop="label" label="标签" width="180" />
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="maxTemp" label="最高气温" width="180" />
    <el-table-column prop="minTemp" label="最低气温" />
  </el-table>

</template>

<script setup>
import { usePredictTemp } from '@src/store/predictTemp.js'
import { ref } from 'vue'

const predictTempStore = usePredictTemp()

</script>

<style lang="less" scoped></style>
