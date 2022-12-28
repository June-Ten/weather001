<template>
  <div class="title">基于时间序列的天气预测</div>
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
          >预测天气数据</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div class="el-table-box">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="label" label="标签" width="180" />
      <el-table-column prop="date" label="日期" width="180" />
      <el-table-column prop="maxTemp" label="最高气温" width="180" />
      <el-table-column prop="minTemp" label="最低气温" />
    </el-table>
  </div>
  <div class="progress-box">
    <el-progress
      type="circle"
      :percentage="percentage"
      :status="status"
      v-if="progressVisible && !Number.isNaN(percentage)"
    />
  </div>
  <div class="iframe-box">
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
import { ref, reactive, watch, onMounted } from 'vue'
import axios from 'axios'
import apis from '@src/apis'

// 年
let yearList = [
  {
    value: '2021',
    label: '2021',
  },
  {
    value: '2022',
    label: '2022',
  },
]
let monthList = []
let dayList = reactive([])

for (let i = 0; i < 12; i++) {
  monthList.push({
    label: (i + 1).toString(),
    value: i < 9 ? '0' + (i + 1).toString() : (i + 1).toString(),
  })
}
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
  year: '',
  month: '',
  day: '',
})
const ruleFormRef = ref()
// 校验规则
const rules = reactive({
  year: [{ required: true, message: '请选择年份', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  day: [{ required: true, message: '请选择月份', trigger: 'blur' }],
})
// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', ruleForm)
      percentage.value = 0
      let params = {
        endDay: ruleForm.year + '-' + ruleForm.month + '-' + ruleForm.day,
      }
      axios.get(apis.tensorflowMaxTemp, { params: params }).then((res) => {
        const { success, data } = res
        if (success) {
          let arr = data.slice(0, 144)
          rawMaxTemp.value = Number(data.at(-1)['Number'])
          rawDate.value = data.at(-1)['Date']
          arr.columns = ['Date', 'Number']
          startPredict(arr)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}


let rawMaxTemp = ref(0)
let rawDate = ref('')

const tableData = reactive([
  // {
  //   date: '2016-05-03',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   date: '2016-05-02',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   date: '2016-05-04',
  //   name: 'Tom',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
])

// 进度条
let percentage = ref(0)
let status = ref('') // 进度条状态 100时变success
let progressVisible = ref(false)

watch(percentage, (newValue) => {
  progressVisible.value = true
  if (newValue === 100) {
    status.value = 'success'
    setTimeout(() => {
      progressVisible.value = false
    }, 3000)
  }
})
let iframeRef = ref(null)
onMounted(() => {
  // 监听iframe传递的数据
  window.addEventListener('message', function (e) {
    console.log('iframe to vue', e.data, typeof e.data)
    if (Object.prototype.toString.call(e.data) === '[object String]') {
      percentage.value = parseInt(((Number(e.data) + 1) / 30).toFixed(2) * 100)
    } else if (Object.prototype.toString.call(e.data) === '[object Array]') {
      console.log('最终结果', e.data)
      let tempItem = e.data[0]
      // 预测
      tableData.push({
        date: tempItem.time,
        maxTemp: tempItem.value - 100,
        minTemp: 1000,
      })
      // 真实
      tableData.push({
        date: rawDate.value,
        maxTemp: rawMaxTemp.value,
        minTemp: 1000,
      })
      tableData.forEach((item, index) => {
        switch (index) {
          case 0:
            item.label = '模型预测'
            break
          case 1:
            item.label = '实际结果'
            break
          case 2:
            item.label = '预测评估'
            break
          default:
            break
        }
      })
    }
  })
  // console.log('iframe内部的数据', iframeRef.value.contentWindow)
  // axios.get(apis.tensorflowMaxTemp).then((res) => {
  //   const { success = false, data = [] } = res
  //   console.log('请求来的数据', res)
  //   if (success) {
  //     arr = data
  //     arr.columns = ['Date', 'Number']
  //   }
  // })
})

// 显示iframe 向iframe传递数据
const startPredict = (arr) => {
  iframeRef.value.contentWindow.postMessage(arr, '*')
}
</script>

<style lang="less" scoped>
.iframe-box {
  width: 100%;
  height: 100%;
  // opacity: 0;
}
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
