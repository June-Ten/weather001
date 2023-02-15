<!-- 南京空气质量aqi -->
<template>
  <div id="aqi" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { inject, onMounted, reactive,ref } from 'vue'
import { useStatAnalStore } from '@src/store/statisticsAnalysis.js'


let echarts = inject('echarts')
const statAnalStore = useStatAnalStore()

onMounted(() => {
  getAQIData()
})

const initEchart = () => {
  let myChart = echarts.init(document.getElementById('aqi'))
  myChart.setOption(option)
}

let aqiData = ref([])
const getAQIData = () => {
  console.log('aqi指数', statAnalStore.aqiData)
  const { data = [], typeData = [] } = statAnalStore.aqiData
  console.log('aqi', data)
  aqiData.value = data
  // option.data = dataList
  option.xAxis.data = data.map((item) => item[0])
  option.series.data = data.map(item => item[1])
  // option.series[0].data = dataList.map((item) => item.value)

  initEchart()
}

let option = reactive({
  title: {
    text: 'AQI指数',
    // left: '1%',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '5%',
    right: '15%',
    bottom: '10%',
  },
  xAxis: {
    data: aqiData.value.map(function (item) {
      return item[0]
    }),
  },
  yAxis: {},
  toolbox: {
    right: 10,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      restore: {},
      saveAsImage: {},
    },
  },
  dataZoom: [
    {
      startValue: '2021-01-01',
    },
    {
      type: 'inside',
    },
  ],
  visualMap: {
    top: 50,
    right: 10,
    pieces: [
      {
        gt: 0,
        lte: 50,
        color: '#93CE07',
      },
      {
        gt: 50,
        lte: 100,
        color: '#FBDB0F',
      },
      {
        gt: 100,
        lte: 150,
        color: '#FC7D02',
      },
      {
        gt: 150,
        lte: 200,
        color: '#FD0100',
      },
      {
        gt: 200,
        lte: 300,
        color: '#AA069F',
      },
      {
        gt: 300,
        color: '#AC3B2A',
      },
    ],
    outOfRange: {
      color: '#999',
    },
  },
  series: {
    name: 'Nanjing AQI',
    type: 'line',
    data: aqiData.value.map(function (item) {
      return item[1]
    }),
    markLine: {
      silent: true,
      lineStyle: {
        color: '#333',
      },
      data: [
        {
          yAxis: 50,
        },
        {
          yAxis: 100,
        },
        {
          yAxis: 150,
        },
        {
          yAxis: 200,
        },
        {
          yAxis: 300,
        },
      ],
    },
  },
})
</script>

<style lang="less" scoped></style>
