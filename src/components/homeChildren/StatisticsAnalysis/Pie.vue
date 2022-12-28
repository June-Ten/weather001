<!-- 饼图,统计一年中晴,阴,多云,雨,雪的分布 -->
<template>
  <div id="pie" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue'
import { useStatAnalStore } from '@src/store/statisticsAnalysis.js'

const statAnalStore = useStatAnalStore()

let echarts = inject('echarts')

onMounted(() => {
  getPieData()
})

const initEchart = () => {
  let myChart = echarts.init(document.getElementById('pie'))
  myChart.setOption(option)
}

const getPieData = () => {
  const { data = [], typeData = [] } = statAnalStore.pieData
  option.series[0].data = data
  option.series[1].data = data
  option.legend.data = typeData
  initEchart()
}

let pieTypeData = reactive([])
let pieData = reactive([])

// reactive([
//   {
//     value: 120,
//     name: '晴',
//   },
//   {
//     value: 20,
//     name: '阴',
//   },
//   {
//     value: 40,
//     name: '多云',
//   },
//   {
//     value: 100,
//     name: '雨',
//   },
//   {
//     value: 50,
//     name: '雪',
//   },
// ])

let option = reactive({
  backgroundColor: '#fff',
  title: {
    text: '天气分布',
    // subtext: `${}`,
    x: 'center',
    y: 'center',
    textStyle: {
      fontWeight: 'normal',
      fontSize: 16,
    },
  },
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    bottom: '0%',
    data: pieTypeData,
  },
  series: [
    {
      type: 'pie',
      selectedMode: 'single',
      radius: ['25%', '58%'],
      color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67','#C45A65'],

      label: {
        normal: {
          position: 'inner',
          formatter: '{d}%',

          textStyle: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 14,
          },
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: pieData,
    },
    {
      type: 'pie',
      radius: ['58%', '83%'],
      itemStyle: {
        normal: {
          color: '#F2F2F2',
        },
        emphasis: {
          color: '#ADADAD',
        },
      },
      label: {
        normal: {
          position: 'inner',
          formatter: '{c}天',
          textStyle: {
            color: '#777777',
            fontWeight: 'bold',
            fontSize: 14,
          },
        },
      },
      data: pieData,
    },
  ],
})
</script>
