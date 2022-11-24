<!-- 中国地图 -->
<template>
  <div style="width: 100%; height: 100%" id="china">china</div>
</template>

<script setup>
import { inject, onMounted } from "vue";
import china from "./china.json";
onMounted(() => {
  initEchart();
});

const echarts = inject("echarts");

const initEchart = () => {
  echarts.registerMap("china", china);
  let myChart = echarts.init(document.getElementById("china"));
  myChart.setOption(option);
};

let dataList = [
  {
    name: "南海诸岛",
    value: 0,
  },
  {
    name: "北京",
    value: 54,
  },
  {
    name: "天津",
    value: 13,
  },
  {
    name: "上海",
    value: 40,
  },
  {
    name: "重庆",
    value: 75,
  },
  {
    name: "河北",
    value: 13,
  },
  {
    name: "河南",
    value: 83,
  },
  {
    name: "云南",
    value: 11,
  },
  {
    name: "辽宁",
    value: 19,
  },
  {
    name: "黑龙江",
    value: 15,
  },
  {
    name: "湖南",
    value: 69,
  },
  {
    name: "安徽",
    value: 60,
  },
  {
    name: "山东",
    value: 39,
  },
  {
    name: "新疆",
    value: 4,
  },
  {
    name: "江苏",
    value: 31,
  },
  {
    name: "浙江",
    value: 104,
  },
  {
    name: "江西",
    value: 36,
  },
  {
    name: "湖北",
    value: 1052,
  },
  {
    name: "广西",
    value: 33,
  },
  {
    name: "甘肃",
    value: 7,
  },
  {
    name: "山西",
    value: 9,
  },
  {
    name: "内蒙古",
    value: 7,
  },
  {
    name: "陕西",
    value: 22,
  },
  {
    name: "吉林",
    value: 4,
  },
  {
    name: "福建",
    value: 18,
  },
  {
    name: "贵州",
    value: 5,
  },
  {
    name: "广东",
    value: 98,
  },
  {
    name: "青海",
    value: 1,
  },
  {
    name: "西藏",
    value: 0,
  },
  {
    name: "四川",
    value: 44,
  },
  {
    name: "宁夏",
    value: 4,
  },
  {
    name: "海南",
    value: 22,
  },
  {
    name: "台湾",
    value: 3,
  },
  {
    name: "香港",
    value: 5,
  },
  {
    name: "澳门",
    value: 5,
  },
];

let option = {
  title: {
    text: "全年降水量",
    left: "center",
  },
  graphic: {
    elements: [
      {
        left: 50,
        top: 9.5,
        type: "image",
      },
    ],
  },
  geo: [
    {
      map: "china",
      selectedMode: "single",
      zoom: 1.2,
      roam: false,
      label: {
        show: true,
      },
      itemStyle: {
        areaColor: "transparent",
      },
    },
  ],
  visualMap: {
    show: false,
    left: "left",
    top: "bottom",
    min: 0,
    max: 50,
    inRange: {
      color: ["#74add1", "#ffd768", "#ff8c71"],
    },
  },
  tooltip: {
    padding: 0,
    formatter: function (params) {
      return `
            <div style="display: flex;flex-direction: column;width:100px;">
              <div style="display: flex;justify-content: center;border-bottom: 1px solid #74add1">
                ${params.name}
              </div>
              <div style="display: flex;align-items: center;">
                <div class="svg-box">
                    <svg t="1669255484207" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7914" width="32" height="32"><path d="M513.664283 758.498467a26.385246 26.385246 0 0 1-26.385246-24.736168v-159.960551a26.385246 26.385246 0 1 1 51.121413 0v158.311473a26.385246 26.385246 0 0 1-24.736167 26.385246" fill="#C3EFFF" p-id="7915"></path><path d="M406.474223 971.229509a26.385246 26.385246 0 0 1-26.385246-26.385246v-158.311473a26.385246 26.385246 0 1 1 51.121413 0v158.311473a26.385246 26.385246 0 0 1-24.736167 26.385246" fill="#C4E9F6" p-id="7916"></path><path d="M619.205265 1024a26.385246 26.385246 0 0 1-24.736168-26.385246v-158.311473a26.385246 26.385246 0 0 1 24.736168-26.385245 26.385246 26.385246 0 0 1 26.385245 26.385245v158.311473A26.385246 26.385246 0 0 1 619.205265 1024" fill="#AAE9FF" p-id="7917"></path><path d="M782.463971 484.751545m-232.519976 0a232.519976 232.519976 0 1 0 465.039952 0 232.519976 232.519976 0 1 0-465.039952 0Z" fill="#91E0FC" p-id="7918"></path><path d="M261.355372 253.880646v-9.894467a242.414443 242.414443 0 1 1 446.900096 128.628072 222.625509 222.625509 0 0 1-324.868335 296.834012 232.519976 232.519976 0 1 1-141.820695-415.567617z" fill="#AAE9FF" p-id="7919"></path></svg>
                </div>
                <div>降水量</div>
              </div>
              <div class="color" style="display: flex;justify-content: center;;width:100%;color:#048AFC;font-size:20px;">700</div>
            </div>
      `;
    },
  },
  series: [
    {
      name: "中国地图",
      type: "map",
      geoIndex: 0,
      data: dataList,
    },
  ],
};
</script>

<style lang="less" scoped></style>
