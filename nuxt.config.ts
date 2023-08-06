// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
  runtimeConfig: {
    giphyAPIKey: process.env.GIPHY_API_KEY,
    giphyRequestLimit: Number(process.env.GIPHY_REQUEST_LIMIT || 25),
    public: {
      giphyRequestLimit: Number(process.env.GIPHY_REQUEST_LIMIT || 25),
      nodeEnv: process.env.NODE_ENV || "development",
      tttServerUrl: process.env.TTT_SERVER_URL || "http://localhost:3001",
    },
  },
});
