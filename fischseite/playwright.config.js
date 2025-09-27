// 🎭 PLAYWRIGHT CONFIGURATION für Fischseite Gästebuch
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 1, // Einzelner Worker für Datenbankoperationen

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],

  // Web Server für lokale Tests
  webServer: {
    command: 'python3 -m http.server 8000',
    port: 8000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
};