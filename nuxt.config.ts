// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/robots"],
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Tic Tac Toe',
      meta: [
        { name: 'description', content: 'Play Tic Tac Toe online' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
      ],
    }
  },
  runtimeConfig: {
    giphyAPIKey: process.env.GIPHY_API_KEY,
    giphyRequestLimit: Number(process.env.GIPHY_REQUEST_LIMIT || 25),
    public: {
      sentryTracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 1),
      sentryDsn: process.env.SENTRY_DSN,
      giphyRequestLimit: Number(process.env.GIPHY_REQUEST_LIMIT || 25),
      nodeEnv: process.env.NODE_ENV || "development",
      tttServerUrl: process.env.TTT_SERVER_URL || "http://localhost:3001",
    },
  },
});
