import { useEffect, useState } from 'react'
import Form from '../components/form/Form'
import appConfig from '../config/app.config'
import { useApp } from '../context/app-context'
import './LoginPage.css'

const modes = {
  login: {
    title: appConfig.name,
    pageTitle: 'Iniciar sesión',
    form: 'login',
    switchLabel: 'He olvidado mi contraseña',
    switchTo: 'forgot',
  },
  forgot: {
    title: 'Recuperar contraseña',
    pageTitle: 'Recuperar contraseña',
    form: 'forgotPassword',
    switchLabel: 'Volver a iniciar sesión',
    switchTo: 'login',
  },
}

export default function LoginPage() {
  const { refreshUser } = useApp()
  const [modeId, setModeId] = useState('login')
  const mode = modes[modeId]

  useEffect(() => {
    document.title = `${mode.pageTitle} · ${appConfig.name}`
  }, [mode])

  return (
    <main className="login">
      <div className="login__card">
        <img className="login__logo" src={appConfig.logo} alt="" />
        <h1 className="login__title">{mode.title}</h1>
        <Form
          key={modeId}
          formId={mode.form}
          onSuccess={modeId === 'login' ? refreshUser : undefined}
        />
        <button type="button" className="login__switch" onClick={() => setModeId(mode.switchTo)}>
          {mode.switchLabel}
        </button>
      </div>
    </main>
  )
}