<template>
  <h1>test</h1>
  <el-button @click="startPredict">开始预测</el-button>
  <div class="iframe-box" >
    <iframe
      src="/tensorflow.html"
      frameborder="0"
      width="100%"
      height="100%"
      ref="iframeRef"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import apis from '@src/apis'

let iframeRef = ref(null)
onMounted(() => {
  window.addEventListener('message',function (e) {
    console.log('接收iframe发送过来的信息',e.data)
  })
  console.log('iframe内部的数据',iframeRef.value.contentWindow)
  axios.get(apis.tensorflowMaxTemp).then((res) => {
    console.log('请求来的数据',res.data)
    arr = res.data
    arr.columns = ['Date', 'Number']
  })
})

let arr = reactive([])

// 显示iframe
const startPredict = () => {
  iframeRef.value.contentWindow.postMessage(arr, '*')
}
</script>

<style lang="less" scoped>
.iframe-box {
  width: 100%;
  height: 100%;
  // opacity: 0;
}
</style>
