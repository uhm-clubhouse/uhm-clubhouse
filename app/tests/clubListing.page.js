import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class ClubListingPage {
  constructor() {
    this.pageId = `#${PageIDs.clubsPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the filter function works */
  async goToFilter(testController) {
    await testController.click(`#${ComponentIDs.clubListingFilter}`);
  }

  /** Checks that the current page has at least two clubs on it.  */
  async hasDefaultClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const clubListing = new ClubListingPage();
