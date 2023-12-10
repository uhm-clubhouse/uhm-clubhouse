import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

class HomePage {
  constructor() {
    this.pageId = `#${PageIDs.homePage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /* Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async checkClubAndLeave(testController) {
    await this.isDisplayed(testController);
    const joinLeaveButton = Selector('#join-button').withText('Leave');
    const joinedClub = Selector('ul');
    await testController.click(joinedClub);
    await testController.click(joinLeaveButton);
  }
}

export const homePage = new HomePage();
