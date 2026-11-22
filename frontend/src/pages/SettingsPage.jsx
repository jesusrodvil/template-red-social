import { useState } from 'react'
import ConfirmButton from '../components/ui/ConfirmButton'
import Form from '../components/form/Form'
import { settingsSections } from '../components/registries/settingsSections'
import { useApp } from '../context/app-context'
import { ApiError, confirmActions } from '../services/api'
import './SettingsPage.css'

export default function SettingsPage({ page }) {
  const { user, refreshUser, logout } = useApp()
  const [errors, setErrors] = useState({})

  const sections = (page.sections ?? []).filter(
    (section) => !section.roles || section.roles.includes(user.role),
  )

  const runConfirmAction = async (section) => {
    setErrors((current) => ({ ...current, [section.id]: null }))
    try {
      await confirmActions[section.confirmAction.action]({ user })
      if (section.confirmAction.logoutAfter) logout()
      refreshUser()
    } catch (err) {
      const text = err instanceof ApiError ? err.message : 'No se ha podido completar la acción.'
      setErrors((current) => ({ ...current, [section.id]: text }))
    }
  }

  return (
    <div className="settings">
      {sections.map((section) => {
        const Component = section.component && settingsSections[section.component]

        return (
          <section
            key={section.id}
            className={
              section.danger ? 'settings__section settings__section--danger' : 'settings__section'
            }
            aria-labelledby={`${section.id}-title`}
          >
            <h2 id={`${section.id}-title`} className="settings__title">
              {section.title}
            </h2>
            {section.description && <p className="settings__description">{section.description}</p>}

            {section.form && <Form formId={section.form} onSuccess={refreshUser} />}
            {Component && <Component />}
            {section.confirmAction && (
              <ConfirmButton
                label={section.confirmAction.label}
                message={section.confirmAction.message}
                confirmLabel={section.confirmAction.confirmLabel}
                danger={section.danger}
                onConfirm={() => runConfirmAction(section)}
              />
            )}
            {errors[section.id] && (
              <p className="form__message form__message--error">{errors[section.id]}</p>
            )}
          </section>
        )
      })}
    </div>
  )
}