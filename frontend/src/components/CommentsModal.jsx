import { useCallback } from 'react'
import { useAsync } from '../hooks/useAsync'
import { getComments } from '../services/api'
import { formatDate } from '../utils/format'
import Avatar from './Avatar'
import Modal from './Modal'
import './CommentsModal.css'

export default function CommentsModal({ postId, onClose }) {
  const loader = useCallback(() => getComments(postId), [postId])
  const { data: comments, loading, error } = useAsync(loader)

  return (
    <Modal title="Comentarios" onClose={onClose}>
      {loading && <p className="muted">Cargando…</p>}
      {error && <p className="muted">No se han podido cargar los comentarios.</p>}
      {comments?.length === 0 && <p className="muted">Todavía no hay comentarios.</p>}
      <ul className="comments">
        {comments?.map((comment) => (
          <li key={comment.id} className="comment">
            <Avatar user={comment.author} size={32} />
            <div>
              <p className="comment__meta">
                <strong>{comment.author.name}</strong> · {formatDate(comment.createdAt)}
              </p>
              <p className="comment__text">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  )
}