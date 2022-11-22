<template>
  test
  <el-button @click="startPredict">开始预测</el-button>
  <div class="iframe-box">
    <iframe
      v-if="iframeVisible"
      src="/tensorflow.html"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>

<script setup>
import {ref} from 'vue'

// 显示iframe
const iframeVisible = ref(false)
const startPredict = ()=> {
  iframeVisible.value = true
}
</script>

<style lang="less" scoped>
.iframe-box {
  width: 100%;
  height: 100%;
}
</style>
