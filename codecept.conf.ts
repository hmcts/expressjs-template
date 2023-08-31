import { config as testConfig } from './src/test/config';

const { setHeadlessWhen } = require('@codeceptjs/configure');

setHeadlessWhen(testConfig.TestHeadlessBrowser);
export const config: CodeceptJS.MainConfig = {
  name: 'functional',
  gherkin: testConfig.Gherkin,
  output: './functional-output/functional/reports',
  helpers: testConfig.helpers,
  tests: './*_test.{js,ts}',
  plugins: {
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
    },
    pauseOnFail: {
      enabled: !testConfig.TestHeadlessBrowser,
    },
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true,
    },
  },
};
