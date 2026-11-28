import { NavLink } from 'react-router'
import Icon from '../ui/Icon'
import UserSummary from './UserSummary'
import { useMenuItems } from './useMenuItems'
import './Sidebar.css'

export default function Sidebar() {
  const { menuPages, footerItems } = useMenuItems()

  return (
    <aside className="sidebar">
      <UserSummary />

      <nav className="sidebar__nav">
        {menuPages.map((page) => (
          <NavLink key={page.id} to={page.path} className="sidebar__link">
            <Icon name={page.icon} />
            {page.title}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {footerItems.map((item) =>
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
              onClick={item.onClick}
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