// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Modules
  modules: ["@pinia/nuxt"],

  // Dev server configuration
  devServer: {
    port: 1234,
  },

  // SSG mode for static site generation
  ssr: true,

  // Global CSS
  css: ["~/assets/css/main.css", "~/assets/css/checkbox.css"],

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || "https://n8n.306.team/webhook/",
    },
  },

  // App config
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      script: [
        // Google Identity Services
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true,
        },
      ],
    },
  },

  // TypeScript config
  typescript: {
    strict: true,
    typeCheck: false, // Disable during dev for faster builds
  },
});
