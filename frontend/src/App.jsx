import { createBrowserRouter, RouterProvider } from 'react-router'
import Sidebar from './components/Sidebar'
import AppProvider from './context/AppProvider'

const router = createBrowserRouter([
  {
    path: '*',
    element: <Sidebar />,
  },
])

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}