import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://landingtesla.yamidev.com",
  output: "static",
  integrations: [tailwind()],
  image: {
    service: { entrypoint: "astro/assets/services/sharp" }
  },
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname
      }
    }
  }
});
