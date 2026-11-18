import { useEffect, useRef } from 'react'
import Icon from './Icon'
import './Modal.css'

export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const close = () => dialogRef.current.close()

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && close()}
    >
      <header className="modal__header">
        <h2>{title}</h2>
        <button
          type="button"
          className="modal__close"
          onClick={close}
          aria-label="Cerrar"
        >
          <Icon name="X" />
        </button>
      </header>
      <div className="modal__body">{children}</div>
    </dialog>
  )
}