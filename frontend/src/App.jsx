import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './components/Layout'
import { pages } from './config/pages.config'
import AppProvider from './context/AppProvider'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: pages.map((page) => ({
      path: page.path,
      element: <p className="muted">Contenido de {page.title}: pendiente.</p>,
      handle: { title: page.title },
    })),
  },
])

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}