import fs from 'fs'
import shelljs from 'shelljs'
import { defineParameterType } from '@cucumber/cucumber'
import types from '../types.js'

function getOptionsRegex(options: readonly string[]): string {
  return `(${options.map((o: string) => o.replace('{string}', "'.*'")).join('|')})`
}

function getListRegex(options: readonly string[]): string {
  const optionsRegex = getOptionsRegex(options)
  return `(${optionsRegex}(?:,${optionsRegex})*)`
}

export function registerCustomParameters(): void {
  const settingsJson = '.vscode/settings.json'
  const json = fs.readFileSync(settingsJson, 'utf8')
  const settings = JSON.parse(json)
  
  // Generate cucumber.parameterTypes format
  const parameterTypes: { name: string; regexp: string }[] = []
  for (const type of [...types]) {
    parameterTypes.push({ 
      name: type.name, 
      regexp: type.options[0] === '.*' ? '.*' : `(${type.options.join('|')})` 
    })
    if (type.canBeList) {
      parameterTypes.push({
        name: `${type.name}_list`,
        regexp: getListRegex(type.options)
      })
    }
  }
  
  settings['cucumber.parameterTypes'] = parameterTypes
  fs.writeFileSync(settingsJson, JSON.stringify(settings, null, 2))
  shelljs.exec(`npx prettier -w --log-level error ${settingsJson}`)
}

function defineCucumberParameterTypes(): void {
  for (const type of [...types]) {
    defineParameterType({
      name: type.name,
      regexp: new RegExp(`(${type.options.join('|')})`),
      transformer: (s: string) => s,
    })
    
    if (type.canBeList) {
      defineParameterType({
        name: `${type.name}_list`,
        regexp: new RegExp(getListRegex(type.options)),
        transformer: (s: string) => s.split(',').map(item => item.trim()),
      })
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  registerCustomParameters()
} else {
  defineCucumberParameterTypes()
}
