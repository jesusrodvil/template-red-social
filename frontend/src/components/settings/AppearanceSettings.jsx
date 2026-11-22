import { useApp } from '../../context/app-context'
import FormField from '../form/FormField'

export default function AppearanceSettings() {
  const { themeMode, scheme, setThemeMode } = useApp()
  const followsSystem = themeMode === 'system'

  return (
    <div className="form">
      <FormField
        field={{
          name: 'dark',
          label: 'Modo noche',
          type: 'toggle',
          disabled: followsSystem,
          help: followsSystem ? 'Ahora lo decide el sistema.' : undefined,
        }}
        value={scheme === 'dark'}
        onChange={(dark) => setThemeMode(dark ? 'dark' : 'light')}
      />
      <FormField
        field={{ name: 'system', label: 'Seguir el modo del sistema', type: 'toggle' }}
        value={followsSystem}
        onChange={(follow) => setThemeMode(follow ? 'system' : scheme)}
      />
    </div>
  )
}