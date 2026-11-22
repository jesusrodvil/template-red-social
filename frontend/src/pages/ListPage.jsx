import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import FormModal from '../components/FormModal'
import Icon from '../components/Icon'
import ListItem from '../components/ListItem'
import { useApp } from '../context/app-context'
import { useAsync } from '../hooks/useAsync'
import { itemActions, listSources } from '../services/api'
import './ListPage.css'

export default function ListPage({ page }) {
  const { user } = useApp()
  const params = useParams()
  const loader = useCallback(
    async () => listSources[page.source]({ user, params }),
    [page.source, user, params],
  )
  const { data: items, loading, error } = useAsync(loader)
  const [seenIds, setSeenIds] = useState(() => new Set())
  const [openForm, setOpenForm] = useState(null)

  const handleSeen = (item) => {
    if (!page.onItemSeen || seenIds.has(item.id)) return
    setSeenIds((current) => new Set(current).add(item.id))
    itemActions[page.onItemSeen]({ user, item })
  }

  return (
    <>
      {page.actions?.length > 0 && (
        <div className="list-page__toolbar">
          {page.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="button button--primary"
              onClick={() => setOpenForm(action.form)}
            >
              <Icon name={action.icon} size={18} />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="muted">Cargando…</p>}
      {error && <p className="muted">No se ha podido cargar la lista.</p>}
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
            />
          ))}
        </ul>
      )}

      {openForm && <FormModal formId={openForm} onClose={() => setOpenForm(null)} />}
    </>
  )
}