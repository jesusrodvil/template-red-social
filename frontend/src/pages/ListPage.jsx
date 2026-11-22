import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import ListItem from '../components/ListItem'
import PageActions from '../components/PageActions'
import { useApp } from '../context/app-context'
import { useAsync } from '../hooks/useAsync'
import { ApiError, itemActions, listSources } from '../services/api'
import './ListPage.css'

export default function ListPage({ page }) {
  const { user } = useApp()
  const params = useParams()
  const loader = useCallback(
    async () => listSources[page.source]({ user, params }),
    [page.source, user, params],
  )
  const { data: items, loading, error, reload } = useAsync(loader)
  const [seenIds, setSeenIds] = useState(() => new Set())
  const [actionError, setActionError] = useState(null)

  const handleSeen = (item) => {
    if (!page.onItemSeen || seenIds.has(item.id)) return
    setSeenIds((current) => new Set(current).add(item.id))
    itemActions[page.onItemSeen]({ user, item })
  }

  const handleAction = async (item, action) => {
    setActionError(null)
    try {
      await itemActions[action.action]({ user, item })
      reload()
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'No se ha podido completar la acción.',
      )
    }
  }

  return (
    <>
      <PageActions page={page} />

      {loading && <p className="muted">Cargando…</p>}
      {error && <p className="muted">No se ha podido cargar la lista.</p>}
      {actionError && <p className="form__message form__message--error">{actionError}</p>}
      {items?.length === 0 && (
        <p className="muted">{page.emptyMessage ?? 'No hay elementos.'}</p>
      )}

      {items?.length > 0 && (
        <ul className="list-page__list">
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={{ ...item, unread: item.unread && !seenIds.has(item.id) }}
              onSeen={handleSeen}
              onAction={handleAction}
            />
          ))}
        </ul>
      )}
    </>
  )
}