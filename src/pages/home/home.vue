<script lang="ts" setup>
import { useMessage, useNotify, useToast } from 'wot-design-uni'
import { useAppStore } from '@/stores/app'

definePage({
  layout: 'tabbar',
  style: {
    'navigationBarTitleText': '',
    'navigationStyle': 'custom',
    'enablePullDownRefresh': true,
    'mp-alipay': {
      transparentTitle: 'always',
      titlePenetrate: 'YES',
    },
  },
})

const app = useAppStore()
const toast = useToast()
const message = useMessage()
const { showNotify } = useNotify()

const count = ref(0)

function setCountPlus() {
  count.value = count.value + 1
}

function onUseToast() {
  setCountPlus()

  toast.show(`Hello World ${count.value}`)
}

async function onUseMessage() {
  try {
    await message.confirm({
      confirmButtonProps: { round: false },
      cancelButtonProps: { round: false },
      msg: '提示文案',
      title: '标题',
    })

    console.log('点击了确定按钮')
  }
  catch (error) {
    console.log('点击了取消按钮')
  }
}

async function onShowNotify() {
  setCountPlus()

  showNotify({
    type: 'success',
    message: `Hello World ${count.value}`,
  })
}

function setAppStore() {
  setCountPlus()

  app.setToken({
    accessToken: `__accessToken__`,
    refreshToken: `__refreshToken__`,
    accessTokenExpire: Date.now() + 1000 * 60 * 60 * 24,
    refreshTokenExpire: Date.now() + 1000 * 60 * 60 * 24 * 7,
  })
}

function resetAppStore() {
  app.resetToken()
}

function toEcharts() {
  useRouter().navigate('/pages/home/echarts', {
    a: 1,
    b: '2',
    c: true,
    d: { d1: 1, d2: 2 },
    resData: JSON.stringify({
      a: 1,
      b: '2',
      c: true,
      d: { d1: 1, d2: 2 },
    }),
  })
}

async function getUserInfo() {
  const data = await useAppStore().getLoginUserInfo()
  uni.showToast({ title: data?.userName })
}

function toCheckPerm() {
  useRouter().navigate('/pages/home/check-perm')
}

const { loading, data: mockList, total, isLastPage, page, reload } = usePagination(
  (pageNo, pageSize) => alovaInstance.Get<any>('/mockList', {
    meta: { authRole: null },
    params: { pageNo, pageSize },
  }),
  {
    append: true,
    initialData: {
      pageNo: 1,
      pageSize: 20,
      rows: [],
      totalRows: 0,
    },
    initialPage: 1,
    initialPageSize: 20,
    total: response => response.data?.totalRows || 0,
    data: response => response.data?.rows || [],
  },
).onComplete(() => uni.stopPullDownRefresh())

onReachBottom(() => page.value++)
onPullDownRefresh(() => reload())
</script>

<template>
  <NavBar title="首页" />

  <view>
    <WdButton @click="setCountPlus">
      count: {{ count }}
    </WdButton>

    <WdButton @click="onUseToast">
      useToast
    </WdButton>

    <WdButton @click="onUseMessage">
      useMessage
    </WdButton>

    <WdButton @click="onShowNotify">
      showNotify
    </WdButton>

    <WdButton @click="setAppStore">
      设置Pinia数据
    </WdButton>

    <WdButton @click="resetAppStore">
      删除Pinia数据
    </WdButton>

    <WdButton @click="getUserInfo">
      获取用户信息
    </WdButton>

    <WdButton @click="toEcharts">
      Echarts
    </WdButton>

    <WdButton @click="toCheckPerm">
      检查权限
    </WdButton>

    <div>
      <div v-for="item in mockList" :key="item.id" class="center py-8 even:bg-[#F9F9F9]">
        {{ item.value }}
      </div>
      <div v-if="isLastPage" class="center bg-[#E1E1E1] py-4">
        已经到底了~(总数{{ total }})
      </div>
      <div v-else-if="loading" class="center bg-[#E1E1E1] py-4">
        数据装载中...
      </div>
    </div>
  </view>
</template>

<!-- <style lang="scss" scoped></style> -->
