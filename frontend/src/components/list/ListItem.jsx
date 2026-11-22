import { Link } from 'react-router'
import { formatDate } from '../../utils/format'
import { pathTo } from '../../utils/routes'
import Avatar from '../ui/Avatar'
import Icon from '../ui/Icon'
import Spinner from '../ui/Spinner'
import './ListItem.css'

export default function ListItem({ item, onSeen, onAction, busyActionId = null }) {
  const markSeen = () => item.unread && onSeen?.(item)
  const isLink = item.link && !item.actions

  const content = (
    <>
      <Avatar
        user={{ name: item.title, avatar: item.image }}
        size={44}
        shape={item.imageShape}
      />
      <div className="list-item__text">
        <p className="list-item__title">{item.title}</p>
        {item.subtitle && <p className="list-item__subtitle">{item.subtitle}</p>}
        {item.actions && (
          <div className="list-item__actions">
            {item.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={action.primary ? 'button button--primary button--small' : 'button button--small'}
                disabled={busyActionId !== null}
                onClick={() => onAction?.(item, action)}
              >
                {busyActionId === action.id && <Spinner size="sm" />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {item.date && (
        <time className="list-item__date" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      )}
      {isLink && !item.date && (
        <Icon name="ChevronRight" className="list-item__chevron" />
      )}
      {item.unread && (
        <span className="list-item__dot" role="img" aria-label="No leída" />
      )}
    </>
  )

  return (
    <li className="list-item">
      {isLink ? (
        <Link
          to={pathTo(item.link)}
          className="list-item__row"
          onMouseEnter={markSeen}
          onFocus={markSeen}
        >
          {content}
        </Link>
      ) : (
        <div className="list-item__row" onMouseEnter={markSeen} onFocus={markSeen}>
          {content}
        </div>
      )}
    </li>
  )
}