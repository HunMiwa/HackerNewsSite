import homePO from '../page-objects/homePO.js'
import { CustomWorld } from '../support/world.js'
import { AssertText } from './core.js'


export async function CheckPageTitle(this: CustomWorld) {
  const title = await this.page.title()
  await AssertText(title, homePO.page_title)
}

