import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "ky7gvm",
  e2e: {
    baseUrl: "https://r0969387-realbeans.myshopify.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    password: "ramiro123"
  }
});
