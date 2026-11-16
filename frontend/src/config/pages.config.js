export const pages = [
  {
    id: 'inicio',
    path: '/',
    title: 'Inicio',
    type: 'feed',
    source: 'groupsFeed',
    showInMenu: false,
    visible: true,
    roles: ['admin', 'user'],
  },
  {
    id: 'grupos',
    path: '/grupos',
    title: 'Grupos',
    icon: 'Users',
    type: 'list',
    showInMenu: true,
    visible: true,
    roles: ['admin', 'user'],
  },
  {
    id: 'notificaciones',
    path: '/notificaciones',
    title: 'Notificaciones',
    icon: 'Bell',
    type: 'list',
    showInMenu: true,
    visible: true,
    roles: ['admin', 'user'],
  },
  {
    id: 'cuenta',
    path: '/cuenta',
    title: 'Cuenta',
    type: 'settings',
    showInMenu: false,
    visible: true,
    roles: ['admin', 'user'],
  },
  {
    id: 'ajustes',
    path: '/ajustes',
    title: 'Ajustes',
    type: 'settings',
    showInMenu: false,
    visible: true,
    roles: ['admin', 'user'],
  },
]

export const menuConfig = {
  userSectionLink: '/cuenta',
  footerItems: [
    { id: 'ajustes', label: 'Ajustes', icon: 'Settings', path: '/ajustes' },
    { id: 'logout', label: 'Cerrar sesión', icon: 'LogOut', action: 'logout' },
  ],
}