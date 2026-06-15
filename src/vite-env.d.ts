/// <reference types="vite/client" />

declare module '*.png' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  readonly VITE_PREVIEW_AUTH?: string
  readonly VITE_PREVIEW_USER?: string
  readonly VITE_PREVIEW_PASS?: string
  readonly VITE_BASE_PATH?: string
  /** Set to "false" to force procedural SimpleTank instead of hero GLB */
  readonly VITE_USE_HERO_GLB?: string
  /** procedural (default) | glb | simple — hero tank render mode for V2-A */
  readonly VITE_HERO_TANK_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
