import type { RouteObject } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { BookingPage } from '../pages/BookingPage'
import { BookingsPage } from '../pages/BookingsPage'
import { ConfirmationPage } from '../pages/ConfirmationPage'
import { ExperiencePage } from '../pages/ExperiencePage'
import { ExplorePage } from '../pages/ExplorePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RouteErrorPage } from '../pages/RouteErrorPage'

/** Mapa de rotas do app. Compartilhado entre o navegador e os testes. */
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <ExplorePage /> },
      { path: 'experiencias/:experienceId', element: <ExperiencePage /> },
      { path: 'experiencias/:experienceId/reservar', element: <BookingPage /> },
      { path: 'reserva/:bookingId/confirmada', element: <ConfirmationPage /> },
      { path: 'reservas', element: <BookingsPage /> },
      { path: 'perfil', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
