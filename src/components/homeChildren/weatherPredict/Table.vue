<template>
  <el-table :data="props.tableDataSource" stripe style="width: 100%">
    <el-table-column prop="label" label="标签" width="180" />
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="maxTemp" label="最高气温" width="180" />
    <el-table-column prop="minTemp" label="最低气温" />
    <el-table-column prop="aqiLevel" label="质量等级" />
    <el-table-column prop="aqiNumber" label="AQI指数" />
  </el-table>

</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['tableDataSource'])


</script>

<style lang="less" scoped></style>
