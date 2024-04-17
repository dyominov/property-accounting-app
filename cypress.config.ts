import { defineConfig } from "cypress";
import resetDB from './cypress/tasks/resetDb';
import seedDB from './cypress/tasks/seedDb';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', { resetDB, seedDB });
    },
    retries: {
      runMode: 3,
    },
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
