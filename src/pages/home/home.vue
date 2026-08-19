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
const uuidText = ref('')

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

async function onGenUuid() {
  const { UUID } = await import('@sub-vendor/plugin/uuid')
  uuidText.value = UUID.v4()
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
  useRouter().push({
    path: '/pages/demo/echarts',
    params: {
      a: '1',
      b: '2',
      c: 'true',
      // d: { d1: 1, d2: 2 },
      resData: JSON.stringify({
        a: 1,
        b: '2',
        c: true,
        d: { d1: 1, d2: 2 },
      }),
    },
  })
}

async function getUserInfo() {
  const data = await useAppStore().getLoginUserInfo()
  uni.showToast({ title: data?.userName })
}

function toCheckPerm() {
  useRouter().push('/pages/demo/check-perm')
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

  <view class="home-page">
    <!-- 功能按钮区域 -->
    <view class="section">
      <view class="section__title">
        UI 组件
      </view>
      <view class="section__card">
        <view class="btn-grid">
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
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section__title">
        数据操作
      </view>
      <view class="section__card">
        <view class="btn-grid">
          <WdButton @click="setAppStore">
            设置Pinia数据
          </WdButton>

          <WdButton @click="resetAppStore">
            删除Pinia数据
          </WdButton>

          <WdButton @click="getUserInfo">
            获取用户信息
          </WdButton>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section__title">
        页面跳转 <text class="section__subtitle">
          （含路由拦截器演示）
        </text>
      </view>
      <view class="section__card">
        <view class="btn-grid">
          <WdButton @click="toEcharts">
            Echarts
          </WdButton>

          <WdButton @click="toCheckPerm">
            检查权限
          </WdButton>
        </view>
      </view>
    </view>

    <!-- 加密解密区域 -->
    <view class="section">
      <view class="section__title">
        AES 加解密 <text class="section__subtitle">
          （含分包使用演示）
        </text>
      </view>
      <view class="section__card">
        <view class="crypto-box">
          <input v-model="inputText" placeholder="请输入内容" class="crypto-input">
          <view class="crypto-btns">
            <WdButton :loading="cryptoLoading" @click="onEncrypt">
              加密
            </WdButton>
            <WdButton :loading="cryptoLoading" @click="onDecrypt">
              解密
            </WdButton>
          </view>
        </view>
        <view v-if="resultText" class="crypto-result">
          {{ resultText }}
        </view>
      </view>
    </view>

    <!-- UUID 生成区域 -->
    <view class="section">
      <view class="section__title">
        UUID 生成 <text class="section__subtitle">
          （含分包使用演示）
        </text>
      </view>
      <view class="section__card">
        <view class="crypto-box">
          <WdButton @click="onGenUuid">
            生成 UUID
          </WdButton>
        </view>
        <view v-if="uuidText" class="crypto-result">
          {{ uuidText }}
        </view>
      </view>
    </view>

    <!-- 列表演示区域 -->
    <view class="section">
      <view class="section__title">
        列表演示 <text class="section__subtitle">
          （alova usePagination）
        </text>
      </view>
      <view class="section__card section__card--flush">
        <view v-for="item in mockList" :key="item.id" class="list-item">
          {{ item.value }}
        </view>
        <view v-if="isLastPage" class="list-footer">
          已经到底了~(总数{{ total }})
        </view>
        <view v-else-if="loading" class="list-footer">
          数据装载中...
        </view>
      </view>
    </view>
  </view>
</template>

<!-- <style lang="scss" scoped></style> -->

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  padding: 24rpx;
  background: #f5f5f5;
}

.section {
  margin-bottom: 32rpx;

  &__title {
    padding-left: 8rpx;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  &__subtitle {
    font-size: 24rpx;
    font-weight: 400;
    color: #999;
  }

  &__card {
    padding: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgb(0 0 0 / 4%);

    &--flush {
      padding: 0;
      overflow: hidden;
    }
  }
}

.btn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.crypto-box {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.crypto-input {
  flex: 1;
  height: 72rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 12rpx;
}

.crypto-btns {
  display: flex;
  flex-shrink: 0;
  gap: 12rpx;
}

.crypto-result {
  padding: 20rpx;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
  word-break: break-all;
  background: #f8f8f8;
  border-radius: 12rpx;
}

.list-item {
  padding: 28rpx 24rpx;
  font-size: 28rpx;
  color: #333;

  & + & {
    border-top: 1rpx solid #f0f0f0;
  }

  &:nth-child(even) {
    background: #fafafa;
  }
}

.list-footer {
  padding: 24rpx;
  font-size: 26rpx;
  color: #999;
  text-align: center;
  background: #f8f8f8;
}
</style>
