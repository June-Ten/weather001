<!-- 天气查询 -->
<template>
  <div class="title">查询热门城市不同日期的天气数据</div>
  <div class="select-box">
    <el-select
      v-model="provinceValue"
      class="province-select"
      placeholder="省份"
      size="large"
      @change="provinceChange"
    >
      <el-option
        v-for="item in provinceOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="cityValue"
      class="city-select"
      placeholder="城市"
      size="large"
    >
      <el-option
        v-for="item in provinceOptions[provinceOptionsIndex].cityOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="monthValue"
      class="month-select"
      placeholder="月份"
      size="large"
    >
      <el-option
        v-for="item in monthOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button
      size="large"
      class="queryBtn"
      type="primary"
      @click="queryWeahter"
      >查询</el-button
    >
  </div>
</template>

<script setup>
import { ref } from "vue";

// 当一级select省份改变,二级select 城市也会改变
const provinceChange = (value) => {
  provinceOptions.map((item, index) => {
    if (item.value === value) {
      provinceOptionsIndex.value = index;
    }
  });
  cityValue.value = "";
};

let provinceValue = ref("");
let provinceOptionsIndex = ref(0);

let cityValue = ref("");
// 省份,城市
const provinceOptions = [
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

let monthValue = ref("");
const monthOptions = [
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
// 天气查询方法
const queryWeahter = () => {
  console.log("查询的城市", cityValue.value,'月份',monthValue.value);
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
.select-box {
  display: flex;
  align-items: center;
  height: 80px;
  .city-select {
    margin-left: 20px;
  }
  .queryBtn {
    margin-left: 20px;
  }
  .month-select {
    margin-left: 20px;
  }
}
</style>
