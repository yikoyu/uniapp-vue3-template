<script lang="ts" setup>
import AvatarPng from '@/packages/sub-static/static/avatar.png'
import { useAppStore } from '@/stores/app'

definePage({
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

function toLogin() {
  useAppStore().logout().finally(() => {
    useRouter().navigate('/pages/login/login')
  })
}
</script>

<template>
  <NavBar title="我的" />

  <div class="center flex-col pt-4">
    <!-- <div class="rounded-full bg-[#ffd8cb] p-4">
      <div class="i-carbon:user h-8 w-8 color-[#FF5631]" />
    </div> -->
    <image class="h-18 w-18 rounded-full" :src="AvatarPng" />

    <div class="pt-3 text-lg font-bold">
      13900000001
    </div>
  </div>

  <div class="px-4 pt-8">
    <WdCellGroup custom-class="rounded-lg overflow-hidden" border>
      <WdCell title="退出登录" is-link @click="toLogin">
        <template #icon>
          <div>
            <div class="i-carbon:logout h-[16px] w-[16px] pr-3 color-primary" />
          </div>
        </template>
      </WdCell>
    </WdCellGroup>
  </div>
</template>

<!-- <style lang="scss" scoped></style> -->
