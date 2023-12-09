import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class AskAdminPage {
  constructor() {
    this.pageId = `#${PageIDs.askAdminPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async submitRequest(testController) {
    await this.isDisplayed(testController);
    const email = `uhm_testing${new Date().getTime()}@test.com`;
    await testController.typeText(`#${ComponentIDs.askAdminEmail}`, email);
    await testController.click(`#${ComponentIDs.askAdminFormSubmit} input.btn.btn-primary`);
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const askAdminPage = new AskAdminPage();
