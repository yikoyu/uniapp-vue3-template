<script lang="ts" setup>
import { useDialog, useNotify, useToast } from '@wot-ui/ui'
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
const dialog = useDialog()
const { showNotify } = useNotify()

const count = ref(0)
const inputText = ref('')
const resultText = ref('')
const cryptoLoading = ref(false)

async function onEncrypt() {
  cryptoLoading.value = true
  try {
    const { CryptoAes } = await import('@sub-vendor/plugin/aes')
    resultText.value = CryptoAes.encrypt(inputText.value)
  }
  finally {
    cryptoLoading.value = false
  }
}

async function onDecrypt() {
  cryptoLoading.value = true
  try {
    const { CryptoAes } = await import('@sub-vendor/plugin/aes')
    resultText.value = CryptoAes.decrypt(inputText.value)
  }
  finally {
    cryptoLoading.value = false
  }
}

function setCountPlus() {
  count.value = count.value + 1
}

function onUseToast() {
  setCountPlus()

  toast.show(`Hello World ${count.value}`)
}

async function onUseDialog() {
  try {
    await dialog.confirm({
      msg: '提示文案',
      title: '标题',
      theme: 'text',
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
  useRouter().navigate('/pages/demo/echarts', {
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
  useRouter().navigate('/pages/demo/check-perm')
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
    <div class="flex flex-wrap gap-1">
      <WdButton @click="setCountPlus">
        count: {{ count }}
      </WdButton>

      <WdButton @click="onUseToast">
        useToast
      </WdButton>

      <WdButton @click="onUseDialog">
        useDialog
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
    </div>

    <div>
      <div class="flex items-center gap-2">
        <input v-model="inputText" placeholder="请输入内容" class="flex-1 border border-gray-300 rounded px-2 py-1">
        <WdButton :loading="cryptoLoading" @click="onEncrypt">
          加密
        </WdButton>
        <WdButton :loading="cryptoLoading" @click="onDecrypt">
          解密
        </WdButton>
      </div>
      <div v-if="resultText" class="mt-2 break-all">
        {{ resultText }}
      </div>
    </div>

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
