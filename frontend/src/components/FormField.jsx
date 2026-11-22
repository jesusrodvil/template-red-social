import { useEffect, useId, useRef } from 'react'
import './FormField.css'

export default function FormField({ field, value, error, onChange }) {
  const id = useId()
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  const describedBy = [field.help && helpId, error && errorId].filter(Boolean).join(' ')

  const common = {
    id,
    name: field.name,
    disabled: field.disabled,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy || undefined,
  }

  if (field.type === 'toggle') {
    return (
      <div className="field field--toggle">
        <div>
          <label className="field__label" htmlFor={id}>
            {field.label}
          </label>
          {field.help && (
            <p id={helpId} className="field__help">
              {field.help}
            </p>
          )}
        </div>
        {['text', 'email', 'password'].includes(field.type) && (
        <input
          {...common}
          className="field__input"
          type={field.type}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      </div>
    )
  }

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>
      {field.help && (
        <p id={helpId} className="field__help">
          {field.help}
        </p>
      )}

      {field.type === 'textarea' && (
        <textarea
          {...common}
          className="field__input"
          rows={field.rows ?? 4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {(field.type === 'text' || field.type === 'password') && (
        <input
          {...common}
          className="field__input"
          type={field.type}
          autoComplete={field.type === 'password' ? 'new-password' : undefined}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.type === 'image' && (
        <ImageInput common={common} value={value} onChange={onChange} />
      )}

      <div className="field__footer">
        {error && (
          <span id={errorId} className="field__error">
            {error}
          </span>
        )}
        {field.maxLength && (
          <span className="field__counter">
            {value.length}/{field.maxLength}
          </span>
        )}
      </div>
    </div>
  )
}

function ImageInput({ common, value, onChange }) {
  const inputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (value?.file) URL.revokeObjectURL(value.url)
    }
  }, [value])

  const handleChange = (event) => {
    const file = event.target.files[0]
    onChange(file ? { file, url: URL.createObjectURL(file) } : null)
  }

  const handleRemove = () => {
    inputRef.current.value = ''
    onChange(null)
  }

  return (
    <div className="field__image">
      {value?.url && <img className="field__preview" src={value.url} alt="" />}
      <input {...common} ref={inputRef} type="file" accept="image/*" onChange={handleChange} />
      {value && (
        <button type="button" className="button button--small" onClick={handleRemove}>
          Quitar
        </button>
      )}
    </div>
  )
}