import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class YourClubsPage {
  constructor() {
    this.pageId = `#${PageIDs.yourClubsPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async gotoEdit(testController) {
    await this.isDisplayed(testController);
    await testController.click(`#${ComponentIDs.yourClubsEdit}`);
  }

  /** Checks that the current page has at least two clubs on it.  */
  async hasDefaultClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const yourClubsPage = new YourClubsPage();
