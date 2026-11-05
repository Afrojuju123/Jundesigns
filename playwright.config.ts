import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://localhost:3000",
    channel: "msedge",
    headless: true,
  },
  projects: [
    {
      name: "edge",
      use: {
        channel: "msedge",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
