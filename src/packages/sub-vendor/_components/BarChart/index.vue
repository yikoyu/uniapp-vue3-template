<script setup lang="ts">
import { BarChart } from 'echarts/charts'
import { DatasetComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import UniEcharts from 'uni-echarts'
import { provideEcharts } from 'uni-echarts/shared'

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
</script>

<template>
  <UniEcharts v-bind="$attrs" />
</template>
