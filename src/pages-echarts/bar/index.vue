<script setup lang="ts">
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import UniEcharts from 'uni-echarts'
import { provideEcharts } from 'uni-echarts/shared'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

// 🚨 重要：由于 npm 插件编译机制问题，需要手动提供 echarts 实例
provideEcharts(echarts)
// provideEchartsTheme('dark')

// 注册需要的组件
echarts.use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DatasetComponent,
  BarChart,
  CanvasRenderer,
])

// 图表配置
const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['销售额', '利润'],
    top: 30,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110],
      itemStyle: {
        color: '#5470c6',
      },
    },
    {
      name: '利润',
      type: 'bar',
      data: [20, 40, 30, 15, 12, 22],
      itemStyle: {
        color: '#91cc75',
      },
    },
  ],
})
</script>

<template>
  <NavBar title="Echarts" />

  <UniEcharts custom-class="h-300px" :option="option" />
</template>
