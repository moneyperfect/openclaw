/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OPENCLAW_BASE_URL: string
    readonly VITE_OPENCLAW_TOKEN: string
    readonly VITE_USE_FAKE_ADAPTER: string
    readonly VITE_CHAT_ENDPOINT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
