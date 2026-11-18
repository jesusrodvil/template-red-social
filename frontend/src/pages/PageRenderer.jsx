import { useApp } from '../context/app-context'
import FeedPage from './FeedPage'
import PlaceholderPage from './PlaceholderPage'

const pageTypes = {
  feed: FeedPage,
}

export default function PageRenderer({ page }) {
  const { user } = useApp()

  if (!page.roles.includes(user.role)) {
    return <PlaceholderPage message="No tienes acceso a esta página." />
  }

  const Component = pageTypes[page.type] ?? PlaceholderPage
  return <Component page={page} />
}