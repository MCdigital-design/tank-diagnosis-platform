/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREVIEW_AUTH?: string
  readonly VITE_PREVIEW_USER?: string
  readonly VITE_PREVIEW_PASS?: string
  readonly VITE_BASE_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
