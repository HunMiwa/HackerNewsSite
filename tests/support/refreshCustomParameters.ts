import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { commonTypes } from '../types.js'

const execAsync = promisify(exec)

export async function refreshCustomParameters(): Promise<void> {
  const projectRoot = path.resolve(process.cwd())
  const vscodeDir = path.join(projectRoot, '.vscode')
  const settingsJson = path.join(vscodeDir, 'settings.json')
  
  // Create .vscode directory if it doesn't exist
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true })
  }
  
  // Read existing settings or create empty object
  let settings: any = {}
  if (fs.existsSync(settingsJson)) {
    try {
      const json = fs.readFileSync(settingsJson, 'utf8')
      settings = JSON.parse(json)
    } catch (error) {
      console.log('Error reading settings.json, creating new one:', error)
      settings = {}
    }
  }
  
  // Build custom parameters for VS Code Cucumber autocomplete
  const params: { parameter: string; value: string }[] = []
  
  for (const type of commonTypes) {
    const optionsRegex = type.regexp.source.replace(/^\(\?\:/, '(').replace(/\)$/, ')')
    params.push({ 
      parameter: `{${type.name}}`, 
      value: optionsRegex
    })
  }
  
  // Update settings
  settings['cucumberautocomplete.customParameters'] = params
  settings['cucumberautocomplete.steps'] = [
    'tests/step-definitions/**/*.ts'
  ]
  settings['cucumberautocomplete.syncfeatures'] = 'tests/features/**/*.feature'
  
  // Write updated settings
  fs.writeFileSync(settingsJson, JSON.stringify(settings, null, 2))
  
  // Format with prettier if available
  try {
    await execAsync(`npx prettier --write --log-level error "${settingsJson}"`)
    console.log('✅ Custom parameters refreshed and formatted')
  } catch (error) {
    console.log('⚠️  Custom parameters refreshed (prettier formatting failed)')
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  refreshCustomParameters().catch(console.error)
}
