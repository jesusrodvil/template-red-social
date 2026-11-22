import { useState } from 'react'
import formsConfig from '../config/forms.config'
import { useApp } from '../context/app-context'
import { ApiError, formActions } from '../services/api'
import FormField from './FormField'
import './Form.css'

const emptyValue = (field) => (field.type === 'image' ? null : '')

const initialValues = (fields) =>
  Object.fromEntries(fields.map((field) => [field.name, emptyValue(field)]))

function validate(fields, values) {
  const errors = {}
  for (const field of fields) {
    const value = values[field.name]
    if (field.required && !value?.toString().trim()) {
      errors[field.name] = 'Este campo es obligatorio.'
    } else if (field.pattern && value && !new RegExp(field.pattern).test(value.trim())) {
      errors[field.name] = field.patternMessage ?? 'El formato no es válido.'
    } else if (field.type === 'image' && value && !value.file.type.startsWith('image/')) {
      errors[field.name] = 'El archivo tiene que ser una imagen.'
    }
  }
  return errors
}

export default function Form({ formId, context, onSuccess, onCancel, resetOnSuccess = false }) {
  const form = formsConfig[formId]
  const { user } = useApp()
  const [values, setValues] = useState(() => initialValues(form.fields))
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState(null)

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setMessage(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newErrors = validate(form.fields, values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSending(true)
    setMessage(null)
    try {
      const result = await formActions[form.submit](values, { user, ...context })
      if (resetOnSuccess) setValues(initialValues(form.fields))
      if (typeof result === 'string') setMessage({ type: 'success', text: result })
      setSending(false)
      onSuccess?.(result)
    } catch (error) {
      const text =
        error instanceof ApiError ? error.message : 'No se ha podido enviar. Inténtalo de nuevo.'
      setMessage({ type: 'error', text })
      setSending(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {form.fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={(value) => setValue(field.name, value)}
        />
      ))}
      {message && (
        <p className={`form__message form__message--${message.type}`} role="status">
          {message.text}
        </p>
      )}
      <div className="form__actions">
        {onCancel && (
          <button type="button" className="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="button button--primary" disabled={sending}>
          {form.submitLabel}
        </button>
      </div>
    </form>
  )
}