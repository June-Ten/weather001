<!-- 天气状况统计分析 -->
<template>
  <div class="title">查询热门城市的天气状况统计分析</div>
  <div class="el-form-box">
    <el-form :inline="true" ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item prop="province">
        <el-select
          @change="onChange"
          v-model="ruleForm.province"
          placeholder="省份"
          size="large"
        >
          <el-option
            v-for="item in provinceAndCityData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="city">
        <el-select v-model="ruleForm.city" placeholder="城市" size="large">
          <el-option
            v-for="item in cityList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="year">
        <el-select size="large" placeholder="年份" v-model="ruleForm.year">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryWeather(ruleFormRef)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { provinceAndCityData,CodeToText } from 'element-china-area-data'
import { useStatAnalStore } from '@src/store/statisticsAnalysis.js'

const statAnalStore = useStatAnalStore()

// 省份,城市
let province = ref('')
let city = ref('')
let cityList = ref()
const onChange = (value) => {
  city.value = ''
  let tempIndex = provinceAndCityData.findIndex((item) => {
    return value === item.value
  })
  cityList.value = provinceAndCityData[tempIndex].children
}

// 年份
const yearList = [
  {
    label: '2021',
    value: '2021',
  },
  {
    label: '2022',
    value: '2022',
  },
]

const ruleForm = reactive({
  province,
  city,
  year:'',
})
const ruleFormRef = ref()
// 校验规则
const rules = reactive({
  province: [{ required: true, message: '请选择省份', trigger: 'blur' }],
  city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
  year: [{ required: true, message: '请选择年份', trigger: 'blur' }],
})

// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      statAnalStore.getStatAnal({
        city: CodeToText[ruleForm.city],
        year: ruleForm.year,
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 20px;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
}
.el-form-box {
  margin-top: 20px;
}
</style>
