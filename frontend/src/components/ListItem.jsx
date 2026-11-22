import { Link } from 'react-router'
import { formatDate } from '../utils/format'
import { pathTo } from '../utils/routes'
import Avatar from './Avatar'
import Icon from './Icon'
import './ListItem.css'

export default function ListItem({ item, onSeen }) {
  const markSeen = () => item.unread && onSeen?.(item)

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
      </div>
      {item.date && (
        <time className="list-item__date" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      )}
      {item.link && !item.date && (
        <Icon name="ChevronRight" className="list-item__chevron" />
      )}
      {item.unread && (
        <span className="list-item__dot" role="img" aria-label="No leída" />
      )}
    </>
  )

  return (
    <li className="list-item">
      {item.link ? (
        <Link
          to={pathTo(item.link)}
          className="list-item__row"
          onMouseEnter={markSeen}
          onFocus={markSeen}
        >
          {content}
        </Link>
      ) : (
        <div className="list-item__row" onMouseEnter={markSeen}>
          {content}
        </div>
      )}
    </li>
  )
}