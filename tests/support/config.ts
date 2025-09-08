// Load environment variables from .env file
import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

// Test environment configuration
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  timeout: {
    page: parseInt(process.env.PAGE_TIMEOUT || '30000'),
    test: parseInt(process.env.TEST_TIMEOUT || '60000'),
  },
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
  }
}

// Validate required config
if (!config.baseUrl) {
  throw new Error('BASE_URL environment variable is required')
}

console.log('Test configuration loaded:', {
  baseUrl: config.baseUrl,
  headless: config.browser.headless
})
