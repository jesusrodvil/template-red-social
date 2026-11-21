import { useEffect, useState } from 'react'
import { Link, Outlet, useMatches } from 'react-router'
import appConfig from '../config/app.config'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout() {
  const matches = useMatches()
  const title = matches.at(-1)?.handle?.title ?? ''
  const [subtitle, setSubtitle] = useState(null)

  useEffect(() => {
    document.title = [title, subtitle, appConfig.name].filter(Boolean).join(' · ')
  }, [title, subtitle])

  return (
    <div className="layout" data-sidebar={appConfig.sidebarPosition}>
      <div className="layout__main">
        <header className="layout__header">
          <Link to="/" className="layout__logo">
            <img src={appConfig.logo} alt={appConfig.name} />
          </Link>
          <div>
            <h1 className="layout__title">{title}</h1>
            {subtitle && <p className="layout__subtitle">{subtitle}</p>}
          </div>
        </header>
        <main className="layout__content">
          <Outlet context={{ setSubtitle }} />
        </main>
      </div>
      <Sidebar />
    </div>
  )
}