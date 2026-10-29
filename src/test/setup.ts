import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { api } from '../api/client'
import { setScenario } from '../lib/scenario'

// O jsdom não implementa scrollTo, usado pelo ScrollRestoration do React Router.
window.scrollTo = () => {}

afterEach(() => {
  cleanup()
  setScenario('normal')
  api.reset()
  window.localStorage.clear()
  window.sessionStorage.clear()
})
