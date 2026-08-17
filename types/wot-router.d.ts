import type {
  LocationQuery,
  NavType,
  Router as OriginRouter,
  RouteParams,
} from '@wot-ui/router'

type _RouteLocationRaw = NavigateToOptions['url'] | {
  path?: NavigateToOptions['url']
  name?: string
  params?: RouteParams
  query?: LocationQuery
  hash?: string
  replace?: boolean
  navType?: NavType
  animationType?: string
  animationDuration?: number
}

interface _Router extends Omit<OriginRouter, 'push' | 'replace' | 'replaceAll' | 'pushTab'> {
  push: (to: _RouteLocationRaw) => Promise<any>
  replace: (to: _RouteLocationRaw) => Promise<any>
  replaceAll: (to: _RouteLocationRaw) => Promise<any>
  pushTab: (to: _RouteLocationRaw) => Promise<any>
}

declare module '@wot-ui/router' {
  export function useRouter(): _Router
}
