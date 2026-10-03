/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base path for the Go API. Defaults to `/api` (proxied by Vite in dev). */
  readonly VITE_API_BASE_URL?: string;
  /** Absolute backend origin used by the Vite dev proxy for `/api`. */
  readonly VITE_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
