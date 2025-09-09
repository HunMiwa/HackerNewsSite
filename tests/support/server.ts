import { spawn, exec, ChildProcess } from 'child_process'
import { promisify } from 'util'
import fetch from 'node-fetch'
import { ServerConfig, config } from './config.js'

const execPromise = promisify(exec)

export class ServerManager {
  private process: ChildProcess | null = null
  private config: ServerConfig

  constructor(serverConfig: Partial<ServerConfig> = {}) {
    this.config = {
      ...config.server,
      ...serverConfig
    }
  }

  private get baseUrl(): string {
    return `http://${this.config.host}:${this.config.port}`
  }

  private async killExistingProcesses(): Promise<void> {
      console.log('Cleaning up existing processes...')
      try {
        
        await execPromise(`lsof -ti:${this.config.port} | xargs kill -9 2>/dev/null || true`)
        await execPromise('pkill -f "npm run dev" 2>/dev/null || true')
        await execPromise('pkill -f "vite" 2>/dev/null || true')
      
        await this.sleep(2000)
    } catch (error) {
      console.log('No existing processes found or error during cleanup')
    }
  }

  private async isServerReady(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${this.baseUrl}${this.config.healthCheckPath}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      return false
    }
  }

  private async waitForServer(): Promise<void> {
    const startTime = Date.now()
    
    console.log(`Waiting for server at ${this.baseUrl} to be ready...`)
    
    while (Date.now() - startTime < this.config.maxStartupTime) {
      if (await this.isServerReady()) {
        console.log('------- Server is ready! -------')
        return
      }
      
      console.log(`Server not ready yet, retrying in ${this.config.healthCheckInterval}ms...`)
      await this.sleep(this.config.healthCheckInterval)
    }
    
    throw new Error(`Server failed to start within ${this.config.maxStartupTime}ms`)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async start(): Promise<void> {
    try {
      if (await this.isServerReady()) {
        console.log('------- Server is already running, reusing existing server -------')
        return
      }

      await this.killExistingProcesses()

      console.log(`Starting server with command: ${this.config.command.join(' ')}`)
      
      this.process = spawn(this.config.command[0], this.config.command.slice(1), {
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false,
        cwd: this.config.cwd
      })

      this.process.on('error', (error) => {
        console.error('Server process error:', error)
      })

      this.process.on('exit', (code, signal) => {
        console.log(`Server process exited with code ${code} and signal ${signal}`)
      })

      if (process.env.DEBUG_SERVER) {
        this.process.stdout?.on('data', (data) => {
          console.log(`Server stdout: ${data}`)
        })

        this.process.stderr?.on('data', (data) => {
          console.log(`Server stderr: ${data}`)
        })
      }

      await this.waitForServer()
      
    } catch (error) {
      await this.stop()
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.process) {
      return
    }

    console.log('Stopping server...')

    return new Promise((resolve) => {
      if (!this.process) {
        resolve()
        return
      }

      this.process.kill('SIGTERM')

      const timeout = setTimeout(() => {
        if (this.process && !this.process.killed) {
          console.log('Force killing server process...')
          this.process.kill('SIGKILL')
        }
      }, 5000)

      this.process.on('exit', () => {
        clearTimeout(timeout)
        this.process = null
        console.log('Server stopped successfully')
        resolve()
      })
    })
  }

  async restart(): Promise<void> {
    await this.stop()
    await this.start()
  }

  isRunning(): boolean {
    return this.process !== null && !this.process.killed
  }

  getProcess(): ChildProcess | null {
    return this.process
  }
}

export const defaultServer = new ServerManager()

export async function startServer(serverConfig?: Partial<ServerConfig>): Promise<ServerManager> {
  const server = serverConfig ? new ServerManager(serverConfig) : defaultServer
  await server.start()
  return server
}

export async function stopServer(server: ServerManager = defaultServer): Promise<void> {
  await server.stop()
}
