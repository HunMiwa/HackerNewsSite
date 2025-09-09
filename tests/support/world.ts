import { Browser, Page } from '@playwright/test'

export interface CustomWorld {
  browser: Browser
  page: Page
}

declare module '@cucumber/cucumber' {
  interface World extends CustomWorld {}
}
