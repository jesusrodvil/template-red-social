import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout'
import { pages } from './config/pages.config'
import AppProvider from './context/AppProvider'
import PageRenderer from './pages/PageRenderer'
import PlaceholderPage from './pages/PlaceholderPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      ...pages
        .filter((page) => page.visible)
        .map((page) => ({
          path: page.path,
          element: <PageRenderer page={page} />,
          handle: { title: page.title },
        })),
      {
        path: '*',
        element: <PlaceholderPage message="Esta página no existe." />,
        handle: { title: 'No encontrada' },
      },
    ],
  },
])

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}