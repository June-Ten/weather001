<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { provide } from 'vue'
import * as echarts from 'echarts';

provide('echarts',echarts)
</script>

<template>
  <router-view></router-view>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,body {
  margin: 0;
  height: 100%;
}
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
