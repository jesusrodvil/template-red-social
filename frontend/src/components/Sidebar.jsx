import { Link, NavLink } from 'react-router'
import { menuConfig, pages } from '../config/pages.config'
import { useApp } from '../context/app-context'
import { formatUsername } from '../utils/format'
import Avatar from './Avatar'
import Icon from './Icon'
import './Sidebar.css'

export default function Sidebar() {
  const { user, logout } = useApp()
  const actions = { logout }
  const username = formatUsername(user)

  const menuPages = pages.filter(
    (page) => page.visible && page.showInMenu && page.roles.includes(user.role),
  )

  return (
    <aside className="sidebar">
      <Link to={menuConfig.userSectionLink} className="sidebar__user">
        <Avatar user={user} size={56} />
        <div>
          <p className="sidebar__name">{user.name}</p>
          {username && <p className="sidebar__username">{username}</p>}
        </div>
      </Link>

      <nav className="sidebar__nav">
        {menuPages.map((page) => (
          <NavLink key={page.id} to={page.path} className="sidebar__link">
            <Icon name={page.icon} />
            {page.title}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {menuConfig.footerItems.map((item) =>
          item.path ? (
            <NavLink
              key={item.id}
              to={item.path}
              className="sidebar__icon-btn"
              title={item.label}
              aria-label={item.label}
            >
              <Icon name={item.icon} size={26} />
            </NavLink>
          ) : (
            <button
              key={item.id}
              type="button"
              className="sidebar__icon-btn"
              onClick={actions[item.action]}
              title={item.label}
              aria-label={item.label}
            >
              <Icon name={item.icon} size={26} />
            </button>
          ),
        )}
      </div>
    </aside>
  )
}