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
    await this.isDisplayed(testController);
    await testController.click(`#${ComponentIDs.clubListingFilter}`);
    await testController.click(`#${ComponentIDs.clubListingShowAll}`);
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }

  /** Checks that the search function works */
  async goToSearch(testController) {
    await this.isDisplayed(testController);
    const interest = 'club';
    const searchInput = Selector(`#${ComponentIDs.clubListingSearch}`);
    await testController.typeText(searchInput, interest);
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(1);
  }

  async joinOrLeaveClub(testController) {
    await this.isDisplayed(testController);
    const joinButton = Selector('#join-button');
    await testController.click(joinButton);
  }

  /** Checks that the current page has at least two clubs on it.  */
  async hasDefaultClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const clubListing = new ClubListingPage();
