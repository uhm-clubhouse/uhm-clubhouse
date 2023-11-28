import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class CreateClubPage {
  constructor() {
    this.pageId = `#${PageIDs.createClubPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then adds a new club */
  async createClub(testController) {
    const name = `radgrad-${new Date().getTime()}`;
    const contact = 'testing@testing.com';
    const description = 'Testing this page';
    await this.isDisplayed(testController);
    // Define the new project
    await testController.typeText(`#${ComponentIDs.createClubFormName}`, name);
    await testController.typeText(`#${ComponentIDs.createClubFormContact}`, contact);
    await testController.typeText(`#${ComponentIDs.createClubFormDescription}`, description);

    // Select two interests.
    const interestsSelector = Selector(`#${ComponentIDs.createClubFormInterests} div.form-check input`);
    await testController.click(interestsSelector.nth(0));
    await testController.click(interestsSelector.nth(3));

    await testController.click(`#${ComponentIDs.createClubFormSubmit} input.btn.btn-primary`);
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const createClubPage = new CreateClubPage();
