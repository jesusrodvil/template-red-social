import { menuConfig, pages } from '../../config/pages.config'
import { useApp } from '../../context/app-context'

export function useMenuItems() {
  const { user, logout } = useApp()
  const actions = { logout }
  const isVisible = (page) => page.visible && page.roles.includes(user.role)

  const menuPages = pages.filter((page) => isVisible(page) && page.showInMenu)

  const tabPages = menuConfig.mobileTabs
    .map((id) => pages.find((page) => page.id === id))
    .filter((page) => page && isVisible(page))

  const footerItems = menuConfig.footerItems.map((item) => ({
    ...item,
    onClick: item.action ? actions[item.action] : undefined,
  }))

  return { menuPages, tabPages, footerItems }
}