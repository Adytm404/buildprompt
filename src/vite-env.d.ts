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

interface DuitkuCheckoutResult {
  resultCode: string;
  merchantOrderId: string;
  reference: string;
}

interface DuitkuCheckoutOptions {
  defaultLanguage?: 'id' | 'en';
  currency?: string;
  successEvent?: (result: DuitkuCheckoutResult) => void;
  pendingEvent?: (result: DuitkuCheckoutResult) => void;
  errorEvent?: (result: DuitkuCheckoutResult) => void;
  closeEvent?: (result: DuitkuCheckoutResult) => void;
}

interface Window {
  checkout?: {
    process: (reference: string, options: DuitkuCheckoutOptions) => void;
  };
}
