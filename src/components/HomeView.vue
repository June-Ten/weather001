<template>
  <el-menu
    router
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
    :ellipsis="false"
  >
    <div class="svg-box">
      <svg
        t="1668562414085"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3559"
        width="48"
        height="48"
      >
        <path
          d="M745.472 976H240c-114.688 0-207.744-93.056-207.744-207.744V262.784C32.256 148.096 125.312 55.04 240 55.04h505.472c114.688 0 207.744 93.056 207.744 207.744v505.472c0 114.688-93.056 207.744-207.744 207.744z"
          fill="#00A9FA"
          p-id="3560"
        ></path>
        <path
          d="M350.08 480.512c3.456-69.76 55.424-126.336 122.752-137.6-25.984-49.28-77.696-82.944-137.344-82.944-85.76 0-155.264 69.504-155.264 155.264 0 61.312 35.584 114.176 87.168 139.392 13.824-36.352 44.544-64.256 82.688-74.112z"
          fill="#FFCA33"
          p-id="3561"
        ></path>
        <path
          d="M665.6 438.528c-9.728 0-19.328 1.024-28.544 2.944-19.456-58.624-74.752-100.864-139.904-100.864-8.32 0-16.384 1.024-24.32 2.432 11.392 21.632 17.92 46.208 17.92 72.32 0 85.76-69.504 155.264-155.264 155.264-24.448 0-47.488-5.76-68.096-15.872-4.992 13.184-7.936 27.52-7.936 42.496 0 66.816 54.144 120.832 120.832 120.832H665.6c77.184 0 139.776-62.592 139.776-139.776S742.784 438.528 665.6 438.528z"
          fill="#DBEEF7"
          p-id="3562"
        ></path>
        <path
          d="M490.752 415.232c0-26.112-6.528-50.688-17.92-72.32-67.328 11.264-119.296 67.968-122.752 137.6-38.144 9.856-68.864 37.76-82.688 74.112 20.608 10.112 43.648 15.872 68.096 15.872 85.76 0 155.264-69.504 155.264-155.264z"
          fill="#FFFAE1"
          p-id="3563"
        ></path>
      </svg>
      <div class="head-title">天气分析与预测系统</div>
      <div class="avatar-box" style="margin-left: 10px; cursor: pointer">
        <el-dropdown>
          <el-avatar> {{ username }} </el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="flex-grow"></div>
    <el-menu-item index="/home/weather-query">热门城市历史天气</el-menu-item>
    <el-menu-item index="/home/weather-statistic-analysis"
      >天气状况统计分析</el-menu-item
    >
    <el-menu-item index="/home/precipitation">全国降水量</el-menu-item>
    <el-menu-item index="/home/predict-temp">气温预测</el-menu-item>
    <el-menu-item index="/home/manage-user">用户管理</el-menu-item>
    <el-sub-menu index="/home/tensorflow">
      <template #title>气温预测</template>
      <el-menu-item index="/home/predict-maxTemp">最高气温</el-menu-item>
      <el-menu-item index="/home/predict-minTemp">最低气温</el-menu-item>
      <el-menu-item index="/home/predict-test">test</el-menu-item>
      <el-menu-item index="/home/predict-last">last</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
let username = ref('')
let activeIndex = ref('')
// 刷新页面后保持菜单选中状态
onMounted(async () => {
  await router.isReady()
  activeIndex.value = route.path
  let storageUsername = sessionStorage.getItem('username')
  username.value = storageUsername === 'sys' ? '系统' : '普通'
})

const handleSelect = (key, keyPath) => {
  // console.log(key, keyPath);
}

const logout = () => {
  router.push('/login')
}
</script>

<style lang="less" scoped>
.svg-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-grow {
  flex-grow: 1;
}
.main {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0px 30px;
}
</style>
