import { useEffect, useState } from 'react'
import themeConfig from '../config/theme.config'
import { useAsync } from '../hooks/useAsync'
import { useColorScheme } from '../hooks/useColorScheme'
import { getCurrentUser } from '../services/api'
import { AppContext } from './app-context'

export default function AppProvider({ children }) {
  const { data: user, loading, error } = useAsync(getCurrentUser)
  const [themeMode, setThemeMode] = useState(themeConfig.defaultMode)
  const scheme = useColorScheme(themeMode)

  useEffect(() => {
    const root = document.documentElement
    const colors = themeConfig.modes[scheme]
    root.dataset.theme = scheme
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
  }, [scheme])

  const logout = () => console.info('logout: pendiente de implementar')

  if (loading) return null
  if (error || !user) return <p className="muted">No se ha podido cargar el usuario.</p>

  return (
    <AppContext.Provider value={{ user, themeMode, setThemeMode, logout }}>
      {children}
    </AppContext.Provider>
  )
}