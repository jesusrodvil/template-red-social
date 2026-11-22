import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useApp } from '../context/app-context'
import { useAsync } from '../hooks/useAsync'
import { ApiError, getGroupInfo, leaveGroup } from '../services/api'
import { pathTo } from '../utils/routes'
import ConfirmButton from './ConfirmButton'
import Form from './Form'
import ListItem from './ListItem'
import Modal from './Modal'
import './GroupInfoModal.css'

function leaveMessage(group) {
  if (!group.isOwner) return `¿Seguro que quieres salir de ${group.name}?`
  if (!group.nextOwnerName) {
    return `Eres el único miembro: si sales, ${group.name} se borrará. ¿Seguro?`
  }
  return `Eres el dueño: si sales, ${group.nextOwnerName} pasará a serlo. ¿Seguro?`
}

export default function GroupInfoModal({ onClose }) {
  const { user } = useApp()
  const { groupId } = useParams()
  const navigate = useNavigate()
  const loader = useCallback(() => getGroupInfo({ user, groupId }), [user, groupId])
  const { data: group, loading, error } = useAsync(loader)
  const [leaveError, setLeaveError] = useState(null)

  const handleLeave = async () => {
    try {
      await leaveGroup({ user, groupId })
      navigate(pathTo({ page: 'grupos' }))
    } catch (err) {
      setLeaveError(err instanceof ApiError ? err.message : 'No se ha podido salir del grupo.')
    }
  }

  return (
    <Modal title={group?.name ?? 'Grupo'} onClose={onClose}>
      {loading && <p className="muted">Cargando…</p>}
      {error && <p className="muted">No se ha podido cargar el grupo.</p>}

      {group && (
        <>
          <h3 className="group-info__heading">Miembros ({group.members.length})</h3>
          <ul className="group-info__members">
            {group.members.map((member) => (
              <ListItem key={member.id} item={member} />
            ))}
          </ul>

          {group.isOwner && (
            <section className="group-info__section">
              <Form formId="inviteMember" context={{ groupId }} resetOnSuccess />
            </section>
          )}

          <section className="group-info__section">
            <ConfirmButton
              label="Salir del grupo"
              message={leaveMessage(group)}
              confirmLabel="Salir"
              onConfirm={handleLeave}
            />
            {leaveError && <p className="form__message form__message--error">{leaveError}</p>}
          </section>
        </>
      )}
    </Modal>
  )
}