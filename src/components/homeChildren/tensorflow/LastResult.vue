<!-- 最终结果 -->
<template>
  <div class="title">基于时间序列的天气预测</div>
  <div class="el-form-box">
    <el-form :inline="true" ref="ruleFormRef" :model="ruleForm" :rules="rules">
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
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
let monthList = [];
let dayList = reactive([]);
onMounted(() => {
  // 填充月份数组
  Array(12)
    .fill(1)
    .map((item, index) => {
      let tempItem = {
        label: index.toString(),
        value: index.toString(),
      };
      monthList.push(tempItem);
    });
});

//month select change
const monthChange = (value) => {
  let numberMonth = Number(value);
  let dayTotal = 0;
  // 31天的月
  const longDays = [1, 3, 5, 7, 8, 10, 12];
  // 2月 28天
  if (numberMonth === 2) {
    dayTotal = 28;
  } else if (longDays.includes(numberMonth)) {
    dayTotal = 31;
  } else {
    dayTotal = 30;
  }
  dayList.length = 0;//清空数组
  for (let i = 1; i <= dayTotal ; i++) {
    let item = {
      label: i.toString(),
      value: i.toString(),
    }
    dayList.push(item)
  }
};

const ruleForm = reactive({
  month: "",
  day: "",
});
const ruleFormRef = ref();
// 校验规则
const rules = reactive({
  month: [{ required: true, message: "请选择月份", trigger: "blur" }],
  day: [{ required: true, message: "请选择月份", trigger: "blur" }],
});
// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!", ruleForm);
    } else {
      console.log("error submit!", fields);
    }
  });
};

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
tableData.forEach((item,index)=> {
  switch (index) {
    case 0:
      item.label = '模型预测'
      break;
    case 1:
      item.label = '实际结果'
      break;
    case 2:
      item.label = '预测评估'
      break;
    default:
      break;
  }
})

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
