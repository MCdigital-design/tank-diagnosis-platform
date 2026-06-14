/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREVIEW_AUTH?: string
  readonly VITE_PREVIEW_USER?: string
  readonly VITE_PREVIEW_PASS?: string
  readonly VITE_BASE_PATH?: string
  /** Set to "false" to force procedural SimpleTank instead of hero GLB */
  readonly VITE_USE_HERO_GLB?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
