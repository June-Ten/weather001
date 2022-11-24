<!-- 天气状况统计分析 -->
<template>
  <div class="chinaMap-box">
    <div class="chinaMap">
      <ChinaMap></ChinaMap>
    </div>
  </div>
  <div class="pieAndBar-box">
    <div class="pie">
      <Pie v-if="visible"></Pie>
    </div>
    <div class="bar">
      <WindBar v-if="visible"></WindBar>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Pie from "./Pie.vue";
import ChinaMap from "./ChinaMap.vue";
import WindBar from "./WindBar.vue";


let visible = ref(false);

// 节流函数
const throttle = (fn, delay = 200) => {
  let timer;
  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = true; // timer = null是传统写法,这里是只想运行一次
    }, delay);
  };
}
// 防抖
const debounce = (fn,delay = 200) =>{
  let timer
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(this)
    }, delay);
  }
}
window.onscroll = debounce(function () {
  if (!visible.value) {
    visible.value = true;
  }
}, 400);
</script>

<style lang="less" scoped>
.chinaMap-box {
  display: flex;
  justify-content: center;
  width: 100%;
  .chinaMap {
    width: 800px;
    height: 500px;
  }
}
.pieAndBar-box {
  display: flex;
  margin-top: 100px;
  width: 100%;
  height: 500px;
  .pie {
    width: 500px;
    height: 500px;
  }
  .bar {
    width: 500px;
    height: 500px;
  }
}
</style>
