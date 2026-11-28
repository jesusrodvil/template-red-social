import { useId, useRef } from 'react'
import { NavLink } from 'react-router'
import Icon from '../ui/Icon'
import UserSummary from './UserSummary'
import { useMenuItems } from './useMenuItems'
import './MobileMenu.css'

export default function MobileMenu() {
  const { footerItems } = useMenuItems()
  const panelId = useId()
  const panelRef = useRef(null)

  const close = () => panelRef.current?.hidePopover()

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="button button--icon"
        popoverTarget={panelId}
        aria-label="Abrir menú"
      >
        <Icon name="Menu" />
      </button>

      <div id={panelId} ref={panelRef} popover="auto" className="mobile-menu__panel">
        <UserSummary avatarSize={44} onNavigate={close} />
        <ul className="mobile-menu__list">
          {footerItems.map((item) => (
            <li key={item.id}>
              {item.path ? (
                <NavLink to={item.path} className="mobile-menu__item" onClick={close}>
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              ) : (
                <button
                  type="button"
                  className="mobile-menu__item"
                  onClick={() => {
                    close()
                    item.onClick?.()
                  }}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}