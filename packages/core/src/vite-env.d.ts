/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob(pattern: string, options?: any): Record<string, () => Promise<any>>;
  globEager?(pattern: string, options?: any): Record<string, any>;
}
