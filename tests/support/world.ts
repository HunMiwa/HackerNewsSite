import { Browser, Page } from '@playwright/test'

export interface CustomWorld {
  browser: Browser
  page: Page
}

// Extend the Cucumber World type
declare module '@cucumber/cucumber' {
  interface World extends CustomWorld {}
}
