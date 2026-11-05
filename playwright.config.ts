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
    {
      name: "mobile-390",
      use: {
        channel: "msedge",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "mobile-360",
      use: {
        channel: "msedge",
        viewport: { width: 360, height: 800 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
