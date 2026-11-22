import { useState } from 'react'
import './ConfirmButton.css'

export default function ConfirmButton({ label, message, confirmLabel, danger = false, onConfirm }) {
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)

  const handleConfirm = async () => {
    setSending(true)
    try {
      await onConfirm()
    } finally {
      setSending(false)
      setConfirming(false)
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        className={danger ? 'button button--danger' : 'button'}
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="confirm">
      <p className="confirm__message">{message}</p>
      <div className="confirm__actions">
        <button type="button" className="button" onClick={() => setConfirming(false)}>
          Cancelar
        </button>
        <button
          type="button"
          className={danger ? 'button button--danger-solid' : 'button button--primary'}
          disabled={sending}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}