import { useCallback, useState } from 'react'
import formsConfig from '../../config/forms.config'
import { useApp } from '../../context/app-context'
import { useAsync } from '../../hooks/useAsync'
import { ApiError, formActions, formLoaders } from '../../services/api'
import FormField from './FormField'
import './Form.css'

const emptyValue = (field) => {
  if (field.type === 'image') return null
  if (field.type === 'toggle') return false
  return ''
}

const initialValues = (fields, loaded = {}) =>
  Object.fromEntries(fields.map((field) => [field.name, loaded[field.name] ?? emptyValue(field)]))

function validate(fields, values) {
  const errors = {}
  for (const field of fields) {
    const value = values[field.name]
    const text = typeof value === 'string' ? value.trim() : value
    if (field.required && !text) {
      errors[field.name] = 'Este campo es obligatorio.'
    } else if (field.minLength && text && text.length < field.minLength) {
      errors[field.name] = `Tiene que tener al menos ${field.minLength} caracteres.`
    } else if (field.pattern && text && !new RegExp(field.pattern).test(text)) {
      errors[field.name] = field.patternMessage ?? 'El formato no es válido.'
    } else if (field.matches && value !== values[field.matches]) {
      errors[field.name] = field.matchesMessage ?? 'Los valores no coinciden.'
    } else if (field.type === 'image' && value?.file && !value.file.type.startsWith('image/')) {
      errors[field.name] = 'El archivo tiene que ser una imagen.'
    }
  }
  return errors
}

export default function Form(props) {
  const form = formsConfig[props.formId]
  if (!form.load) return <FormBody {...props} form={form} />
  return <LoadedForm {...props} form={form} />
}

function LoadedForm(props) {
  const { user } = useApp()
  const loader = useCallback(
    async () => formLoaders[props.form.load]({ user, ...props.context }),
    [props.form.load, user, props.context],
  )
  const { data, loading, error } = useAsync(loader)

  if (loading) return <p className="muted">Cargando…</p>
  if (error) return <p className="muted">No se han podido cargar los datos.</p>
  return <FormBody {...props} loaded={data} />
}

function FormBody({ form, loaded, context, onSuccess, onCancel, resetOnSuccess = false }) {
  const { user } = useApp()
  const fields = form.fields.filter((field) => !field.roles || field.roles.includes(user?.role))
  const [values, setValues] = useState(() => initialValues(fields, loaded))
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
    const newErrors = validate(fields, values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSending(true)
    setMessage(null)
    try {
      const result = await formActions[form.submit](values, { user, ...context })
      if (resetOnSuccess) setValues(initialValues(fields))
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
      {fields.map((field) => (
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