<!-- 天气状况统计分析 -->
<template>
  <div class="title">查询各年份的全国各省降水量</div>
  <div class="el-form-box">
    <el-form :inline="true" ref="ruleFormRef" :model="ruleForm" :rules="rules">
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
import { usePrecipitationStore } from '@src/store/precipitation.js'

const precipitationStore = usePrecipitationStore()


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
  year:'',
})
const ruleFormRef = ref()
// 校验规则
const rules = reactive({
  year: [{ required: true, message: '请选择年份', trigger: 'blur' }],
})

// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      precipitationStore.getPrecipitationData({
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
