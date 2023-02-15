<template>
  <div id="sun" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue'
import { useStatAnalStore } from '@src/store/statisticsAnalysis.js'

const statAnalStore = useStatAnalStore()

onMounted(() => {
  getSunnyData()
})

const initEchart = () => {
  let myChart = echarts.init(document.getElementById('sun'))
  myChart.setOption(option)
}

const getSunnyData = () => {
  const { data = [], typeData = [] } = statAnalStore.sunnyDayData
  console.log('晴天', data)
  dataList.map((item) => {
    console.log('item月份', item.name.slice(0, -1))
    Object.keys(data).map((key) => {
      if (Number(key) === Number(item.name.slice(0, -1))) {
        item.value = data[key].toString()
      }
    })
  })
  console.log('dataList', dataList)
  option.data = dataList
  option.xAxis.data = dataList.map(item => item.name)
  option.series[0].data = dataList.map(item => item.value)
  initEchart()
}

let echarts = inject('echarts')

let dataList = reactive([
  {
    name: '1月',
    value: '0',
  },
  {
    name: '2月',
    value: '0',
  },
  {
    name: '3月',
    value: '0',
  },
  {
    name: '4月',
    value: '0',
  },
  {
    name: '5月',
    value: '0',
  },
  {
    name: '6月',
    value: '0',
  },
  {
    name: '7月',
    value: '0',
  },
  {
    name: '8月',
    value: '0',
  },
  {
    name: '9月',
    value: '0',
  },
  {
    name: '10月',
    value: '0',
  },
  {
    name: '11月',
    value: '0',
  },
  {
    name: '12月',
    value: '0',
  },
])

let option = reactive({
  title: {
    text: '每月的晴天数',
    // subtext: `${}`,
    x: 'center',
    // y: 'center',
    // textStyle: {
    //   fontWeight: 'normal',
    //   fontSize: 16,
    // },
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [
        150, 230, 224, 218, 135, 147, 260, 150, 230, 224, 218, 135, 147, 260
      ],
      type: 'line'
    }
  ]
});

// data
// let dataList = [{
//     name: '12月',
//     value: '7'
// }, {
//     name: '1月',
//     value: '6'
// }, {
//     name: '2月',
//     value: '6.5'
// }, {
//     name: '3月',
//     value: '5.3'
// }, {
//     name: '4月',
//     value: '6'
// }, {
//     name: '5月',
//     value: '5.2'
// }, {
//     name: '6月',
//     value: '5.8'
// }]

// let option = reactive({
//   backgroundColor: '#081736',
//   tooltip: {
//     trigger: 'axis',
//     backgroundColor: 'rgba(17,95,182,0.5)',
//     textStyle: {
//       color: '#fff',
//     },
//     triggerOn: 'mousemove',
//     showContent: true,
//   },
//   title: {
//     left: 26,
//     top: 26,
//     textStyle: {
//       color: '#FFFFFF',
//       fontSize: 15,
//       fontWeight: 50000,
//       fontFamily: 'PingFang SC',
//     },
//   },
//   grid: {
//     left: '10%',
//     right: '10%',
//     bottom: '20%',
//     top: '28%',
//     containLabel: true,
//   },
//   dataZoom: [
//     {
//       type: 'inside',
//       start: 0,
//       // end: dataList.length > 15 ? 35 : 100
//     },
//   ],
//   xAxis: {
//     axisLine: {
//       lineStyle: {
//         color: '#397cbc',
//       },
//     },
//     splitLine: {
//       show: false,
//     },
//     axisTick: {
//       show: false,
//     },
//     //轴线上的字
//     axisLabel: {
//       show: true,
//       textStyle: {
//         color: 'rgba(255,255,255,0.8)',
//         fontSize: '14',
//       },
//     },
//     data: ['1月', '2月', '3月', '4月', '5月', '6月','7月', '8月', '9月', '10月', '11月', '12月'],
//   },
//   yAxis: [
//     {
//       name: '晴天统计',
//       nameTextStyle: {
//         color: 'rgba(255,255,255,0.8)',
//       },
//       type: 'value',
//       splitNumber: 4,
//       axisTick: {
//         show: false,
//       },
//       //轴线上的字
//       axisLabel: {
//         show: true,
//         textStyle: {
//           fontSize: '14',
//           color: 'rgba(255,255,255,0.8)',
//         },
//       },
//       axisLine: {
//         lineStyle: {
//           color: '#397cbc',
//         },
//       },
//       //网格线
//       splitLine: {
//         lineStyle: {
//           color: '#11366e',
//         },
//       },
//     },
//   ],
//   series: [
//     {
//       name: '晴天',
//       type: 'line',
//       smooth: true, //是否平滑曲线显示
//       showSymbol: false,
//       markPoint: {
//         data: [
//           {
//             name: '月最高',
//             value: 320,
//             xAxis: 4,
//             yAxis: 320,
//           },
//         ],
//       },
//       itemStyle: {
//         color: '#F3A22D',
//         borderColor: '#F3A22D',
//         borderWidth: 1,
//       },
//       lineStyle: {
//         normal: {
//           width: 2,
//           color: {
//             type: 'linear',
//             colorStops: [
//               {
//                 offset: 0,
//                 color: '#F3A22D', // 0% 处的颜色
//               },
//               {
//                 offset: 1,
//                 color: '#F3A22D', // 100% 处的颜色
//               },
//             ],
//             globalCoord: false, // 缺省为 false
//           },
//           shadowColor: '#F3A22D',
//           shadowBlur: 30,
//           shadowOffsetY: 5,
//         },
//       },
//       areaStyle: {
//         //区域填充样式
//         normal: {
//           color: new echarts.graphic.LinearGradient(
//             0,
//             0,
//             0,
//             1,
//             [
//               {
//                 offset: 0,
//                 color: 'rgba(243,162,45, 0.6)',
//               },
//               {
//                 offset: 0.6,
//                 color: 'rgba(243,162,45, 0.2)',
//               },
//               {
//                 offset: 0.8,
//                 color: 'rgba(243,162,45, 0.1)',
//               },
//             ],
//             false
//           ),
//           shadowColor: 'rgba(243,162,45, 0.1)',
//           shadowBlur: 6,
//         },
//       },
//       data: dataList,
//     },
//   ],
// })

// option && myChart.setOption(option);
// if (option && typeof option === "object") {
//     myChart.setOption(option, true);
//     //  refreshChart(myChart,option);
//     var index5 = 0; //播放所在下标
//     var mTime = setInterval(function () {
//         myChart.dispatchAction({
//             type: 'showTip',
//             seriesIndex: 0,
//             dataIndex: index5
//         });
//         index5++;
//         if (index5 >= 7) {
//             //console.log('data4', fxdata.length)
//             index5 = 0;
//             //console.log(fxdata)
//         }
//     }, 2500);
// }
</script>

<style lang="less" scoped></style>
