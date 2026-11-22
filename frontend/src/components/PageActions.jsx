import { useState } from 'react'
import FormModal from './FormModal'
import Icon from './Icon'
import { modals } from './modals'
import './PageActions.css'

export default function PageActions({ page }) {
  const [openAction, setOpenAction] = useState(null)
  const close = () => setOpenAction(null)

  if (!page.actions?.length) return null

  const OpenModal = openAction?.modal && modals[openAction.modal]

  return (
    <>
      <div className="page-actions">
        {page.actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className={action.iconOnly ? 'button button--icon' : 'button button--primary'}
            title={action.label}
            aria-label={action.iconOnly ? action.label : undefined}
            onClick={() => setOpenAction(action)}
          >
            <Icon name={action.icon} size={18} />
            {!action.iconOnly && action.label}
          </button>
        ))}
      </div>

      {openAction?.form && <FormModal formId={openAction.form} onClose={close} />}
      {OpenModal && <OpenModal page={page} onClose={close} />}
    </>
  )
}