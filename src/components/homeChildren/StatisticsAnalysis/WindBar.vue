<!-- 风向统计柱状图 -->
<template>
  <div id="bar-box" style="width: 100%; height: 100%">风向统计柱状图</div>
</template>

<script setup>
import { inject, onMounted, reactive } from "vue";

const echarts = inject("echarts");
onMounted(() => {
  initEchart();
});

const initEchart = () => {
  let myChart = echarts.init(document.getElementById("bar-box"));
  myChart.setOption(option);
};

let data = reactive([
  {
    name: "Mon",
    value: 120,
  },
  {
    name: "Tue",
    value: 200,
  },
  {
    name: "Wed",
    value: 150,
  },
  {
    name: "Thu",
    value: 80,
  },
  {
    name: "Fri",
    value: 70,
  },
  {
    name: "Sat",
    value: 110,
  },
  {
    name: "Sun",
    value: 130,
  },
]);

const option = {
  title: {
    text: "风向统计",
    x: "center",
  },
  tooltip: {
    show: true,
    trigger: "item",
    formatter: function (params) {
      return params.data.name + ":" + params.data.value;
    },
  },
  xAxis: {
    show: true,
    type: "value",
  },
  yAxis: {
    type: "category",
  },
  dataset: {
    source: data,
  },
  series: [
    {
      type: "bar",
    },
  ],
};
</script>

<style lang="less" scoped></style>
