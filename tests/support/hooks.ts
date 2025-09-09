import { After, Before, BeforeAll, AfterAll } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import { config } from './config.js'

const execPromise = promisify(exec)
let devServerProcess: any = null

BeforeAll({ timeout: 15000 }, async function () {
  console.log('Killing any existing background processes...')
  
  try {
    if (process.platform === 'win32') {
      await execPromise('taskkill /f /im node.exe')
    } else {

      await execPromise('lsof -ti:5173 | xargs kill -9 2>/dev/null || true')

      await execPromise('pkill -f "npm run dev" || true')
      await execPromise('pkill -f "vite" || true')
    }
  } catch (error) {
    console.log('No existing processes to kill or error killing processes:', error)
  }

  console.log('Starting new dev server...')
  
  devServerProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    detached: false,
    cwd: process.cwd()
  })

  devServerProcess.stdout?.on('data', (data: Buffer) => {
    console.log(`Dev server stdout: ${data}`)
  })

  devServerProcess.stderr?.on('data', (data: Buffer) => {
    console.log(`Dev server stderr: ${data}`)
  })

  await new Promise(resolve => setTimeout(resolve, 8000))
  console.log('Dev server should be ready!')
})

AfterAll(async function () {
  console.log('Shutting down dev server...')
  
  if (devServerProcess) {
    devServerProcess.kill('SIGTERM')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (!devServerProcess.killed) {
      devServerProcess.kill('SIGKILL')
    }
    
    devServerProcess = null
  }
  
  console.log('Dev server shut down.')
})

Before(async function () {
  this.browser = await chromium.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo
  })
  this.page = await this.browser.newPage()
})

After(async function () {
  await this.page?.close()
  await this.browser?.close()
})


