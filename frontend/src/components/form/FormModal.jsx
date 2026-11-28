import formsConfig from '../../config/forms.config'
import Form from './Form'
import Modal from '../ui/Modal'

export default function FormModal({ formId, onClose, onSuccess }) {
  const handleSuccess = (result) => {
    onSuccess?.(result)
    onClose()
  }

  return (
    <Modal title={formsConfig[formId].title} onClose={onClose}>
      <Form formId={formId} onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  )
}
