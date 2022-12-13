<template>
  <div>
    <el-select @change="onChange" v-model="provinceValue">
      <el-option
            v-for="item in provinceAndCityData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
    </el-select>
    <el-select v-model="cityValue">
      <el-option
            v-for="item in cityList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
    </el-select>
    <el-button @click="query">查询</el-button>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios';
import { provinceAndCityData} from 'element-china-area-data'

let provinceValue = ref('')
let cityValue = ref('')
let cityList = ref()
const onChange = (value) => {
  let tempIndex = provinceAndCityData.findIndex((item)=> {
    return value === item.value
  })
  cityList.value = provinceAndCityData[tempIndex].children
}

const query = ()=> {
  let params = {
    city: '南京',
    key: 'cc2773a9ca46aae36e441847d88da589'
  }
  const config = {
    headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
  }
  axios.defaults.baseURL = '/juhe'
  console.log('params', params,'config',config)
  axios.post('/simpleWeather/query',params,config).then(res=> {
    console.log('天气',res)
  })
}

</script>

<style lang="less" scoped></style>
