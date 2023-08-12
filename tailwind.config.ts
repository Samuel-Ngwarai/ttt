import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      gridTemplateColumns: {
        // Complex site-specific column configuration
        large: "1fr 2fr",
      },
      gridTemplateRows: {
        small: "1fr 3fr"
      }
    },
  },
  plugins: [],
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./composables/**/*.{js,ts}`,
    `./plugins/**/*.{js,ts}`,
    `./utils/**/*.{js,ts}`,
    `./App.{js,ts,vue}`,
    `./app.{js,ts,vue}`,
    `./Error.{js,ts,vue}`,
    `./error.{js,ts,vue}`,
    `./app.config.{js,ts}`,
  ],
};
