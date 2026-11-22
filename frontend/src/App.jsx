import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/layout/Layout'
import { pages } from './config/pages.config'
import { useApp } from './context/app-context'
import AppProvider from './context/AppProvider'
import LoginPage from './pages/LoginPage'
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

function SessionGate() {
  const { user } = useApp()
  return user ? <RouterProvider router={router} /> : <LoginPage />
}

export default function App() {
  return (
    <AppProvider>
      <SessionGate />
    </AppProvider>
  )
}