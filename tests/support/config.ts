import { config as dotenvConfig } from 'dotenv'
import playwrightConfig from '../../playwright.config.js'

dotenvConfig()

export interface ServerConfig {
  port: number
  host: string
  command: string[]
  cwd?: string
  maxStartupTime: number
  healthCheckInterval: number
  healthCheckPath: string
}

export const config = {
  baseUrl: process.env.BASE_URL || playwrightConfig.use?.baseURL,
  timeout: {
    page: parseInt(process.env.PAGE_TIMEOUT || '30000'),
    test: parseInt(process.env.TEST_TIMEOUT || '60000'),
  },
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
  },
  server: {
    port: parseInt(process.env.SERVER_PORT || '5173'),
    host: process.env.SERVER_HOST || 'localhost',
    command: process.env.SERVER_COMMAND?.split(' ') || ['npm', 'run', 'dev'],
    cwd: process.cwd(),
    maxStartupTime: parseInt(process.env.SERVER_STARTUP_TIMEOUT || '30000'),
    healthCheckInterval: parseInt(process.env.SERVER_HEALTH_CHECK_INTERVAL || '1000'),
    healthCheckPath: process.env.SERVER_HEALTH_CHECK_PATH || '/',
  } as ServerConfig
}

if (!config.baseUrl) {
  throw new Error('BASE_URL environment variable is required')
}

console.log('Test configuration loaded:', {
  baseUrl: config.baseUrl,
  headless: config.browser.headless,
  serverPort: config.server.port
})
