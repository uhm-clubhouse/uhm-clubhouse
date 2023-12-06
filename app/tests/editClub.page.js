import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class EditClubPage {
  constructor() {
    this.pageId = `#${PageIDs.editClubPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then adds a new club */
  async editClub(testController) {
    const name = ' updated';
    const contact = '.update';
    const description = ' Test editing this page';
    await this.isDisplayed(testController);
    // Define the new project
    await testController.typeText(`#${ComponentIDs.editClubFormName}`, name);
    await testController.typeText(`#${ComponentIDs.editClubFormContact}`, contact);
    await testController.typeText(`#${ComponentIDs.editClubFormDescription}`, description);

    // Select two interests.
    const interestsSelector = Selector(`#${ComponentIDs.editClubFormInterests} div.form-check input`);
    await testController.click(interestsSelector.nth(2));
    await testController.click(interestsSelector.nth(4));

    await testController.click(`#${ComponentIDs.editClubFormSubmit} input.btn.btn-primary`);
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const editClubPage = new EditClubPage();
