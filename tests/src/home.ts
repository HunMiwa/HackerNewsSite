import homePO from '../page-objects/homePO.js'
import homeTestData from '../page-objects/homeTestData.js'
import { CustomWorld } from '../support/world.js'
import { AssertText } from './core.js'


export async function CheckPageTitle(this: CustomWorld) {
  const title = await this.page.title()
  await AssertText(title, homeTestData.page_title)
}

export async function InterceptAPICall(this: CustomWorld) {
  await this.page.route('https://hacker-news.firebaseio.com/v0/topstories.json', (route) => route.abort())
}

export async function CheckErrorMessage(this: CustomWorld) {
  const errorMessage = await this.page.locator(homePO.error_message)
  await errorMessage.waitFor()
  const errorMessageText = await errorMessage.textContent()
  await AssertText(errorMessageText ?? '', homeTestData.error_message)
}
