import { useState } from 'react'
import formsConfig from '../config/forms.config'
import { formActions } from '../services/api'
import FormField from './FormField'
import Modal from './Modal'
import './FormModal.css'

const emptyValue = (field) => (field.type === 'image' ? null : '')

function validate(fields, values) {
  const errors = {}
  for (const field of fields) {
    const value = values[field.name]
    if (field.required && !value?.toString().trim()) {
      errors[field.name] = 'Este campo es obligatorio.'
    } else if (field.type === 'image' && value && !value.file.type.startsWith('image/')) {
      errors[field.name] = 'El archivo tiene que ser una imagen.'
    }
  }
  return errors
}

export default function FormModal({ formId, onClose }) {
  const form = formsConfig[formId]
  const [values, setValues] = useState(() =>
    Object.fromEntries(form.fields.map((field) => [field.name, emptyValue(field)])),
  )
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newErrors = validate(form.fields, values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSending(true)
    setSubmitError(null)
    try {
      await formActions[form.submit](values)
      onClose()
    } catch {
      setSubmitError('No se ha podido enviar. Inténtalo de nuevo.')
      setSending(false)
    }
  }

  return (
    <Modal title={form.title} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {form.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={(value) => setValue(field.name, value)}
          />
        ))}
        {submitError && <p className="form-modal__error">{submitError}</p>}
        <div className="form-modal__actions">
          <button type="button" className="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button button--primary" disabled={sending}>
            {form.submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}