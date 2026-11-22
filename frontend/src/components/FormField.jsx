import { useEffect, useId } from 'react'
import './FormField.css'

export default function FormField({ field, value, error, onChange }) {
  const id = useId()
  const errorId = `${id}-error`

  const common = {
    id,
    name: field.name,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  }

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {field.label}
        {field.required && <span aria-hidden="true"> *</span>}
      </label>

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

      {field.type === 'text' && (
        <input
          {...common}
          className="field__input"
          type="text"
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
  useEffect(() => {
    return () => {
      if (value?.url) URL.revokeObjectURL(value.url)
    }
  }, [value])

  const handleChange = (event) => {
    const file = event.target.files[0]
    onChange(file ? { file, url: URL.createObjectURL(file) } : null)
  }

  return (
    <div className="field__image">
      {value?.url && <img className="field__preview" src={value.url} alt="" />}
      <input {...common} type="file" accept="image/*" onChange={handleChange} />
    </div>
  )
}