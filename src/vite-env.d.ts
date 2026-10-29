interface ImportMetaEnv {
  /** "hash" usa createHashRouter. Qualquer outro valor usa createBrowserRouter. */
  readonly VITE_ROUTER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
