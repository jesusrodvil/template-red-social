import { useEffect, useState } from 'react'
import themeConfig from '../config/theme.config'
import Loading from '../components/ui/Loading'
import { useAsync } from '../hooks/useAsync'
import { useColorScheme } from '../hooks/useColorScheme'
import { getCurrentUser, logout as endSession } from '../services/api'
import { AppContext } from './app-context'

const THEME_KEY = 'themeMode'
const THEME_MODES = ['light', 'dark', 'system']

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return THEME_MODES.includes(stored) ? stored : themeConfig.defaultMode
  } catch {
    return themeConfig.defaultMode
  }
}

export default function AppProvider({ children }) {
  const { data: user, loading, error, reload: refreshUser } = useAsync(getCurrentUser)
  const [themeMode, setThemeMode] = useState(readStoredTheme)
  const scheme = useColorScheme(themeMode)

  useEffect(() => {
    const root = document.documentElement
    const colors = themeConfig.modes[scheme]
    root.dataset.theme = scheme
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
  }, [scheme])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, themeMode)
    } catch {
      // Sin acceso al almacenamiento: el modo solo dura hasta recargar.
    }
  }, [themeMode])

  const logout = async () => {
    await endSession()
    refreshUser()
  }

  if (loading) return <Loading fullScreen />
  if (error) return <p className="muted">No se ha podido cargar la sesión.</p>

  return (
    <AppContext.Provider
      value={{ user, refreshUser, themeMode, scheme, setThemeMode, logout }}
    >
      {children}
    </AppContext.Provider>
  )
}