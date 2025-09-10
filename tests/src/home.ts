import homePO from '../page-objects/homePO.js'
import homeTestData from '../page-objects/homeTestData.js'
import { CustomWorld } from '../support/world.js'
import { NavbarButton } from '../types.js'
import { AssertText, AssertVisible } from './core.js'


export async function CheckPageTitle(this: CustomWorld) {
  const title = await this.page.title()
  await AssertText(title, homeTestData.page_title)
}

export async function InterceptAPICall(this: CustomWorld) {
  await this.page.route('**/v0/jobstories.json', route => {
    route.abort('timedout');
  });
}

export async function CheckErrorMessage(this: CustomWorld) {
  const errorMessage = await this.page.locator(homePO.error_message)
  const errorMessageText = await errorMessage.textContent()
  await AssertText(errorMessageText ?? '', homeTestData.error_message)
}

export async function CheckStoriesLoadedAPI(this: CustomWorld, navbarButton: NavbarButton) {
  await this.page.route(`**/v0/${navbarButton}stories.json`, async route => {

    const request = route.request();
    expect(request.url()).toContain(`/v0/${navbarButton}stories.json`);
    expect(request.method()).toBe('GET');
    
    await route.continue();
  });

  const stories = await this.page.locator(homePO.stories_container(navbarButton))
  await AssertVisible(stories)
}

export async function WaitNetworkIdle(this: CustomWorld) {
  await this.page.waitForLoadState('networkidle')
}