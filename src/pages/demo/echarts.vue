<script lang="ts" setup>
import BarChart from '@sub-comp/BarChart/index.vue'
import PieChart from '@sub-comp/PieChart/index.vue'

defineOptions({
  componentPlaceholder: {
    BarChart: 'view',
    PieChart: 'view',
  },
})

definePage({
  style: {
    'navigationBarTitleText': '',
    'navigationStyle': 'custom',
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
    },
  },
})

const query = useQueryAll()
const resData = useQuery('resData')

watchEffect(() => console.log('全部参数 :>> ', query.value))
watchEffect(() => console.log('参数 [resData] :>> ', resData.value))

onShow(async () => {
  const { UUID } = await import('@sub-vendor/plugin/uuid')
  console.log('[echarts] uuid :>> ', UUID.v4())
})

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

// 饼图配置
const pieOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '45%'],
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2,
      },
    },
  ],
})
</script>

<template>
  <NavBar title="Echarts" />

  <BarChart custom-class="h-300px" :option="option" />

  <PieChart custom-class="h-300px mt-4" :option="pieOption" />
</template>

<!-- <style lang="scss" scoped></style> -->
