import { defineConfig } from 'cypress';

const baseUrl = process.env.CYPRESS_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  e2e: {
    baseUrl,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
  },
});
