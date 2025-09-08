import { After, Before, BeforeAll, AfterAll } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { spawn, exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)
let devServerProcess: any = null

BeforeAll({ timeout: 15000 }, async function () {
  console.log('Killing any existing background processes...')
  
  // Kill any existing processes that might be using the dev server port (typically 5173 for Vite)
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
  
  // Start the dev server
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

  // Wait for the dev server to start (give it some time to boot up)
  await new Promise(resolve => setTimeout(resolve, 8000))
  console.log('Dev server should be ready!')
})

AfterAll(async function () {
  console.log('Shutting down dev server...')
  
  if (devServerProcess) {
    devServerProcess.kill('SIGTERM')
    
    // Wait a bit for graceful shutdown, then force kill if needed
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (!devServerProcess.killed) {
      devServerProcess.kill('SIGKILL')
    }
    
    devServerProcess = null
  }
  
  console.log('Dev server shut down.')
})

Before(async function () {
  this.browser = await chromium.launch()
  this.page = await this.browser.newPage()
})

After(async function () {
  await this.page?.close()
  await this.browser?.close()
})


