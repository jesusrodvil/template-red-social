import { NavLink } from 'react-router'
import Icon from '../ui/Icon'
import { useMenuItems } from './useMenuItems'
import './BottomNav.css'

export default function BottomNav() {
  const { tabPages } = useMenuItems()

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {tabPages.map((page) => (
        <NavLink
          key={page.id}
          to={page.path}
          className="bottom-nav__tab"
          title={page.title}
          aria-label={page.title}
        >
          <Icon name={page.icon} size={26} />
        </NavLink>
      ))}
    </nav>
  )
}