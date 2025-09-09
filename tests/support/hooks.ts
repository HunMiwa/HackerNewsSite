import { After, Before, BeforeAll, AfterAll } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { config } from './config.js'
import { defaultServer } from './server.js'

BeforeAll({ timeout: 60000 }, async function () {
  await defaultServer.start()
})

AfterAll(async function () {
  await defaultServer.stop()
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


