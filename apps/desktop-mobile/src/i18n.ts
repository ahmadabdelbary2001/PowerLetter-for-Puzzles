import { setupI18n, i18n } from "@powerletter/core";

// Initialize shared i18n for Desktop/Mobile (Tauri)
setupI18n({ debug: import.meta.env.DEV });

export default i18n;