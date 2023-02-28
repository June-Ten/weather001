<!-- 天气查询 -->
<template>
  <div>
  <div class="title">基于时间序列的天气预测</div>
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
      <el-form-item prop="month">
        <el-select
          size="large"
          placeholder="月份"
          v-model="ruleForm.month"
          @change="monthChange"
        >
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="day">
        <el-select size="large" placeholder="日期" v-model="ruleForm.day">
          <el-option
            v-for="item in dayList"
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
  <!-- <el-progress
    type="circle"
    :percentage="percentage"
    :status="status"
    v-if="progressVisible"
  /> -->
</div>
</template>

<script setup>
import { reactive, ref  } from 'vue'
import { provinceAndCityData, CodeToText } from 'element-china-area-data'
import axios from 'axios'
import apis from '@src/apis'


const props = defineProps(['rawData'])
const emit = defineEmits(['changeData'])

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

// 月份
const monthList = [
  {
    label: '1',
    value: '01',
  },
  {
    label: '2',
    value: '02',
  },
  {
    label: '3',
    value: '03',
  },
  {
    label: '4',
    value: '04',
  },
  {
    label: '5',
    value: '05',
  },
  {
    label: '6',
    value: '06',
  },
  {
    label: '7',
    value: '07',
  },
  {
    label: '8',
    value: '08',
  },
  {
    label: '9',
    value: '09',
  },
  {
    label: '10',
    value: '10',
  },
  {
    label: '11',
    value: '11',
  },
  {
    label: '12',
    value: '12',
  },
]
let dayList = reactive([])
//month select change
const monthChange = (value) => {
  let numberMonth = Number(value)
  let dayTotal = 0
  // 31天的月
  const longDays = [1, 3, 5, 7, 8, 10, 12]
  // 2月 28天
  if (numberMonth === 2) {
    dayTotal = 28
  } else if (longDays.includes(numberMonth)) {
    dayTotal = 31
  } else {
    dayTotal = 30
  }
  dayList.length = 0 //清空数组
  for (let i = 1; i <= dayTotal; i++) {
    let item = {
      label: i.toString(),
      value: i < 10 ? '0' + i.toString() : i.toString(),
    }
    dayList.push(item)
  }
}

const ruleForm = reactive({
  province,
  city,
  month: '',
  day: '',
})
const ruleFormRef = ref()
// 校验规则
const rules = reactive({
  province: [{ required: true, message: '请选择省份', trigger: 'blur' }],
  city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  day: [{ required: true, message: '请选择日期', trigger: 'blur' }],
})


// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let params = {
        city: CodeToText[ruleForm.city],
        endDay: '2021-' + ruleForm.month + '-' + ruleForm.day,
      }
      axios.get(apis.newPredcit, { params: params }).then((res) => {
        console.log('获取来的原始气温数据', res)
        const { success = false, data=[],aqiData=[] } = res
        if (success) {
          console.log('aqi', data)
          emit('changeData',data,aqiData)
        }
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
