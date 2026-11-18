import { useEffect } from 'react'
import { Link, Outlet, useMatches } from 'react-router'
import appConfig from '../config/app.config'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout() {
  const matches = useMatches()
  const title = matches.at(-1)?.handle?.title ?? ''

  useEffect(() => {
    document.title = title ? `${title} · ${appConfig.name}` : appConfig.name
  }, [title])

  return (
    <div className="layout" data-sidebar={appConfig.sidebarPosition}>
      <div className="layout__main">
        <header className="layout__header">
          <Link to="/" className="layout__logo">
            <img src={appConfig.logo} alt={appConfig.name} />
          </Link>
          <h1 className="layout__title">{title}</h1>
        </header>
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  )
}