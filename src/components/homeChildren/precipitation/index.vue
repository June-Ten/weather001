<!-- 全国降水量 -->
<template>
  <HeaderSelect></HeaderSelect>
  <div style="width: 100%;height: 500px;margin-top: 100px;">
    <ChinaMap v-if="precipitationStore.precipitationData.success"></ChinaMap>
  </div>
</template>

<script setup>
import ChinaMap from "./ChinaMap.vue"
import HeaderSelect from "./HeaderSelect.vue"
import { usePrecipitationStore } from '@src/store/precipitation.js'

const precipitationStore = usePrecipitationStore()

</script>

<style lang="less" scoped>

</style>