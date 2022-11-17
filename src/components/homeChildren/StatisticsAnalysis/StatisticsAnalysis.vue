<!-- 天气状况统计分析 -->
<template>
  <div class="pie">
    <Pie></Pie>
  </div>
</template>

<script setup>
import Pie  from './Pie.vue'
</script>

<style lang="less" scoped>
.pie {
  width: 500px;
  height: 500px;
}
</style>