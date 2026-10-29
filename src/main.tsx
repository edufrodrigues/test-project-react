import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router'
import { AppProviders } from './app/AppProviders'
import { routes } from './app/routes'
import './styles/global.css'

// VITE_ROUTER=hash troca para rotas com # (útil em ferramentas que servem o app em iframe ou subpasta).
const router = import.meta.env.VITE_ROUTER === 'hash' ? createHashRouter(routes) : createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
