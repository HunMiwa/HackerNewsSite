import { config } from "../support/config.js";
import { CustomWorld } from "../support/world.js";
import { expect, Locator } from '@playwright/test';

export async function openHackerNews(this: CustomWorld) {
  await this.page.goto(config.baseUrl || '')
}

export async function AssertText(text_got: string, text_expected: string) {
    await expect(text_got).toBe(text_expected)
}
  
export async function AssertNotVisible(element: Locator) {
  await expect(element).not.toBeVisible()
}

export async function AssertVisible(element: Locator) {
  await expect(element).toBeVisible()
}

export async function clickButton(this: CustomWorld, buttonType: string) {
  await this.page.locator(`#${buttonType}_btn`).click()
}