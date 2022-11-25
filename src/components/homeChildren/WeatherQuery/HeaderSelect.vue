<!-- 天气查询 -->
<template>
  <div class="title">查询热门城市不同日期的天气数据</div>
  <div class="el-form-box">
    <el-form :inline="true" ref="ruleFormRef" :model="ruleForm" :rules="rules">
      <el-form-item prop="province">
        <el-select
          @change="provinceChange"
          size="large"
          placeholder="省份"
          v-model="ruleForm.province"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="city">
        <el-select size="large" placeholder="城市" v-model="ruleForm.city">
          <el-option
            v-for="(item,index) in cityList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="month">
        <el-select size="large" placeholder="月份" v-model="ruleForm.month">
          <el-option
            v-for="item in monthList"
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
import { reactive, ref,nextTick } from "vue";

// 省份,城市
const provinceList = [
  {
    value: "江苏",
    label: "江苏",
    cityOptions: [
      {
        value: "南京",
        label: "南京",
      },
      {
        value: "苏州",
        label: "苏州",
      },
    ],
  },
  {
    value: "安徽",
    label: "安徽",
    cityOptions: [
      {
        value: "合肥",
        label: "合肥",
      },
      {
        value: "芜湖",
        label: "芜湖",
      },
    ],
  },
];
// 省份,select,change
const provinceChange = (value) => {
  let index = provinceList.findIndex((item) => {
    return item.value == value;
  });
  cityList.value = provinceList[index].cityOptions;
  
};
//城市 开始是有值,但是是空白
// let cityList = reactive([{
//   label:'',
//   value:'',
// }]);
// 开始是No Data
let cityList = ref([])
const monthList = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "5",
    value: "5",
  },
  {
    label: "6",
    value: "6",
  },
  {
    label: "7",
    value: "7",
  },
  {
    label: "8",
    value: "8",
  },
  {
    label: "9",
    value: "9",
  },
  {
    label: "10",
    value: "10",
  },
  {
    label: "11",
    value: "11",
  },
  {
    label: "12",
    value: "12",
  },
];

const ruleForm = reactive({
  province: "",
  city: "",
  month: "",
});
const ruleFormRef = ref();
// 校验规则
const rules = reactive({
  province: [{ required: true, message: "请选择省份", trigger: "blur" }],
  city: [{ required: true, message: "请选择城市", trigger: "blur" }],
  month: [{ required: true, message: "请选择月份", trigger: "blur" }],
});
// 天气查询先校验再查询
const queryWeather = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
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
  margin-top: 10px;
}
</style>
