import homePO from '../page-objects/homePO.js'
import homeTestData from '../page-objects/homeTestData.js'
import { CustomWorld } from '../support/world.js'
import { NavbarButton } from '../types.js'
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
  const errorMessageText = await errorMessage.textContent()
  await AssertText(errorMessageText ?? '', homeTestData.error_message)
}

export async function CheckStoriesLoadedAPI(this: CustomWorld, navbarButton: NavbarButton) {
  switch (navbarButton) {
    case 'top':
      await this.page.route('**/v0/topstories.json', async route => {

        const request = route.request();
        expect(request.url()).toContain('/v0/topstories.json');
        expect(request.method()).toBe('GET');
        
        await route.continue();
      });
      break
    case 'new':
      break
  }
}
