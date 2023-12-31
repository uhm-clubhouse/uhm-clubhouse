import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signOutPage } from './signout.page';
import { signupPage } from './signup.page';
import { navBar } from './navbar.component';
import { clubListing } from './clubListing.page';
import { yourClubsPage } from './yourClubs.page';
import { createClubPage } from './createClub.page';
import { setAdminPage } from './setAdmin.page';
import { editClubPage } from './editClub.page';
import { askAdminPage } from './askAdmin.page';
import { homePage } from './home.page';
/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme', adminusername: 'admin@foo.com', adminpassword: 'changeme', sadminusername: 'sadmin@foo.com', sadminpassword: 'changeme' };

fixture('uhm-clubhouse localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@foo.com`;
  await navBar.gotoSignUpPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test that club listing page displays and filter and search function works', async (testController) => {
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.hasDefaultClubs(testController);
  await clubListing.goToFilter(testController);
  await clubListing.goToSearch(testController);
});

test('Test that an user can log in and sign out', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await homePage.isDisplayed(testController);
  await navBar.ensureLogout(testController);
});

test('Test that admin request form page displays and an user can submit a request', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAdminRequestPage(testController);
  await askAdminPage.isDisplayed(testController);
  await askAdminPage.submitRequest(testController);
});

test('Test that club listing page displays and the filter and search function works for an user', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.hasDefaultClubs(testController);
  await clubListing.goToFilter(testController);
  await clubListing.goToSearch(testController);
});

test('Test that an user can join a club and view it on the home page', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.joinOrLeaveClub(testController);
  await navBar.gotoHomePage(testController);
  await homePage.isDisplayed(testController);
  await homePage.checkClubAndLeave(testController);
});

test('Test that admin can log in and sign out', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await homePage.isDisplayed(testController);
  await navBar.ensureLogout(testController);
});

test('Test that admin request form page displays', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await navBar.gotoAdminRequestPage(testController);
  await askAdminPage.isDisplayed(testController);
});

test('Test that club listing page displays and the filter and search function works for admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.hasDefaultClubs(testController);
  await clubListing.goToFilter(testController);
  await clubListing.goToSearch(testController);
});

test('Test that an admin can join a club and view it on the home page', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.joinOrLeaveClub(testController);
  await navBar.gotoHomePage(testController);
  await homePage.isDisplayed(testController);
  await homePage.checkClubAndLeave(testController);
});

test('Test that your clubs page and editing a club works for admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await navBar.gotoYourClubsPage(testController);
  await yourClubsPage.isDisplayed(testController);
  await yourClubsPage.gotoEdit(testController);
  await editClubPage.isDisplayed(testController);
  await editClubPage.editClub(testController);
  await navBar.ensureLogout(testController);
});

test('Test that your clubs page and deleting a club works for admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await navBar.gotoYourClubsPage(testController);
  await yourClubsPage.isDisplayed(testController);
  await yourClubsPage.deleteClub(testController);
});

test('Test that create club page works for admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.adminusername, credentials.adminpassword);
  await navBar.gotoCreateClubPage(testController);
  await createClubPage.isDisplayed(testController);
  await createClubPage.createClub(testController);
  await navBar.ensureLogout(testController);
});

test('Test that super admin can log in and sign out', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await homePage.isDisplayed(testController);
  await navBar.ensureLogout(testController);
});

test('Test that club listing page displays and filter and search function works for super admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.hasDefaultClubs(testController);
  await clubListing.goToFilter(testController);
  await clubListing.goToSearch(testController);
});

test('Test that a super admin can join a club and view it on the home page', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await navBar.gotoClubListingPage(testController);
  await clubListing.isDisplayed(testController);
  await clubListing.joinOrLeaveClub(testController);
  await navBar.gotoHomePage(testController);
  await homePage.isDisplayed(testController);
  await homePage.checkClubAndLeave(testController);
});

test('Test that your clubs page and editing a club works for super admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await navBar.gotoYourClubsPage(testController);
  await yourClubsPage.isDisplayed(testController);
  await yourClubsPage.gotoEdit(testController);
  await editClubPage.isDisplayed(testController);
  await editClubPage.editClub(testController);
  await navBar.ensureLogout(testController);
});

test('Test that your clubs page and deleting a club works for super admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await navBar.gotoYourClubsPage(testController);
  await yourClubsPage.isDisplayed(testController);
  await yourClubsPage.deleteClub(testController);
});

test('Test that create club page works for super admins', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await navBar.gotoCreateClubPage(testController);
  await createClubPage.isDisplayed(testController);
  await createClubPage.createClub(testController);
  await navBar.ensureLogout(testController);
});

test('Test that set admin page displays', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.sadminusername, credentials.sadminpassword);
  await navBar.gotoSetAdminPage(testController);
  await setAdminPage.isDisplayed(testController);
  await navBar.ensureLogout(testController);
});
