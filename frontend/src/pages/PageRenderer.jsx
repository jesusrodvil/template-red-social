import { useLocation } from 'react-router'
import { useApp } from '../context/app-context'
import FeedPage from './FeedPage'
import ListPage from './ListPage'
import PageSubtitle from './PageSubtitle'
import PlaceholderPage from './PlaceholderPage'
import SettingsPage from './SettingsPage'

const pageTypes = {
  feed: FeedPage,
  list: ListPage,
  settings: SettingsPage,
}

export default function PageRenderer({ page }) {
  const { user } = useApp()
  const { pathname } = useLocation()

  if (!page.roles.includes(user.role)) {
    return <PlaceholderPage message="No tienes acceso a esta página." />
  }

  const Component = pageTypes[page.type] ?? PlaceholderPage
  return (
    <>
      <PageSubtitle key={`subtitle-${pathname}`} page={page} />
      <Component key={pathname} page={page} />
    </>
  )
}