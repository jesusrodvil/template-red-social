import { useSyncExternalStore } from 'react'

const query = window.matchMedia('(prefers-color-scheme: dark)')

function subscribe(callback) {
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

export function useColorScheme(mode) {
  const systemIsDark = useSyncExternalStore(subscribe, () => query.matches)
  if (mode !== 'system') return mode
  return systemIsDark ? 'dark' : 'light'
}