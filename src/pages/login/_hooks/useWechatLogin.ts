import { ref, unref } from 'vue'
import { useAppStore } from '@/stores/app'
import { toast } from '@/utils/toast'

export function useWechatLogin(hooks?: Fn) {
  const reLaunchUrl = useQuery('redirect')
  const selected = ref(false)

  async function getPhoneNumber(e: Recordable) {
    if (!unref(selected)) {
      toast.show('请阅读并勾选协议')
      return
    }

    const { code } = e.detail
    if (!code) {
      return
    }

    try {
      const token = await useAppStore().wechatLogin(code)

      if (hooks) {
        hooks(token)
        return
      }

      if (token) {
        useRouter().reLaunch(reLaunchUrl.value || '/pages/home/home')
      }
    }
    catch (error: any) {
      const isSessionKeyError = error.data?.status === 1009

      if (isSessionKeyError) {
        toast.error('登录失败请重试')
      }

      console.log('[wechatLogin] error :>> ', error)
    }

    // 登录 API
  }

  return {
    reLaunchUrl,
    selected,
    getPhoneNumber,
  }
}
