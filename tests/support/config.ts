import { config as dotenvConfig } from 'dotenv'
import playwrightConfig from '../../playwright.config.js'
dotenvConfig()

export const config = {
  baseUrl: process.env.BASE_URL || playwrightConfig.use?.baseURL,
  timeout: {
    page: parseInt(process.env.PAGE_TIMEOUT || '30000'),
    test: parseInt(process.env.TEST_TIMEOUT || '60000'),
  },
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
  }
}

if (!config.baseUrl) {
  throw new Error('BASE_URL environment variable is required')
}

console.log('Test configuration loaded:', {
  baseUrl: config.baseUrl,
  headless: config.browser.headless
})
