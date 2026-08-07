import { ref, unref } from 'vue'
import { useAppStore } from '@/stores/app'
import { toast } from '@/utils/toast'

export function usePhoneLogin() {
  const reLaunchUrl = useQuery('redirect')
  const selected = ref(false)

  function ensureAgreed() {
    if (!unref(selected)) {
      toast.show('请阅读并勾选协议')
      return false
    }
    return true
  }

  async function handleLogin(code: string) {
    try {
      const token = await useAppStore().phoneLogin(code)

      if (token) {
        useRouter().reLaunch(reLaunchUrl.value || '/pages/home/home')
      }
    }
    catch (error: any) {
      const isSessionKeyError = error.data?.status === 1009

      if (isSessionKeyError) {
        toast.error('登录失败请重试')
      }
      else {
        toast.error('登录失败，请稍后重试')
      }

      console.log('[phoneLogin] error :>> ', error)
    }
  }

  function getPhoneNumber(e: Recordable) {
    if (!ensureAgreed()) {
      return
    }

    const { code } = e.detail
    if (code) {
      handleLogin(code)
    }
  }

  function onHandleAuthError(e: Recordable) {
    console.log('onHandleAuthError e :>> ', e)
  }

  function getAliAuthorize(e: Recordable) {
    if (!ensureAgreed()) {
      return
    }

    my.getPhoneNumber({
      success: async (res) => {
        const encryptedData = res.response
        if (encryptedData) {
          await handleLogin(encryptedData)
        }
      },
      fail: (err) => {
        console.log('[getPhoneNumber] fail :>> ', err)
      },
    })
  }

  return {
    reLaunchUrl,
    selected,
    getPhoneNumber,
    onHandleAuthError,
    getAliAuthorize,
  }
}
