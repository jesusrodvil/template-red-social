import formsConfig from '../config/forms.config'
import Form from './Form'
import Modal from './Modal'

export default function FormModal({ formId, onClose }) {
  return (
    <Modal title={formsConfig[formId].title} onClose={onClose}>
      <Form formId={formId} onSuccess={onClose} onCancel={onClose} />
    </Modal>
  )
}