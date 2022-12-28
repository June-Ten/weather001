<!-- 风向统计柱状图 -->
<template>
  <div id="bar-box" style="width: 100%; height: 100%">风向统计柱状图</div>
</template>

<script setup>
import axios from 'axios'
import apis from '@src/apis'
import { inject, onMounted, reactive } from 'vue'
import { useStatAnalStore } from '@src/store/statisticsAnalysis.js'

const statAnalStore = useStatAnalStore()

const echarts = inject('echarts')
onMounted(() => {
  // initEchart()
  getWindBar()
})

const initEchart = () => {
  let myChart = echarts.init(document.getElementById('bar-box'))
  myChart.setOption(option)
  window.onresize = function () {
    myChart.resize()
  }
}

const getWindBar = () => {
  // let params = {
  //   city: '南京市',
  //   year: '2021',
  // }
  // axios.get(apis.windStat, { params: params }).then((res) => {
  //   const { success = false, data = [] } = res
  //   console.log('res', res)
  //   option.dataset.source = data
  //   initEchart()
  // })
    option.dataset.source = statAnalStore.windBarData.data
    initEchart()
}

let data = reactive([
  {
    name: 'Mon',
    value: 120,
  },
  {
    name: 'Tue',
    value: 200,
  },
  {
    name: 'Wed',
    value: 150,
  },
  {
    name: 'Thu',
    value: 80,
  },
  {
    name: 'Fri',
    value: 70,
  },
  {
    name: 'Sat',
    value: 110,
  },
  {
    name: 'Sun',
    value: 130,
  },
])

const option = {
  title: {
    text: '风向统计',
    x: 'center',
  },
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: function (params) {
      return params.data.name + ':' + params.data.value
    },
  },
  xAxis: {
    show: true,
    type: 'value',
  },
  yAxis: {
    type: 'category',
  },
  grid: {
          left: '20%',//原来是10%，修改为20%
        },
  dataset: {
    source: data,
  },
  series: [
    {
      type: 'bar',
      barWidth: '90%',
    },
  ],
}
</script>
