import { Meteor } from 'meteor/meteor';
import { Clubs } from '../../api/clubs/Clubs';
import { ClubsInterests } from '../../api/clubs/ClubsInterests';
import { ProfilesClubs } from '../../api/profiles/ProfilesClubs';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';

/**
 * In UHM Clubhouse, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Note that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

const createClubMethod = 'Clubs.create';

/** Creates a new club in the Clubs collection, and also updates ClubsInterests. */
Meteor.methods({
  'Clubs.create'({ clubName, contact, interests, description }) {
    if (!clubName) {
      throw new Meteor.Error('400', 'Club name is required.');
    }
    Clubs.collection.insert({ clubName, contact, description });
    ClubsInterests.collection.remove({ club: clubName });
    if (interests) {
      interests.map((interest) => ClubsInterests.collection.insert({ club: clubName, interest }));
    } else {
      throw new Meteor.Error('At least one interest is required.');
    }
  },
});

const updateClubMethod = 'Clubs.update';

/**
 * The server-side Clubs.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Clubs and ClubsInterests collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Clubs.update'({ clubName, contact, interests, description, _id }) {
    if (!clubName) {
      throw new Meteor.Error('400', 'Club name is required.');
    }
    Clubs.collection.update(_id, { $set: { clubName, contact, description } });
    ClubsInterests.collection.remove({ club: clubName });
    if (interests) {
      interests.map((interest) => ClubsInterests.collection.insert({ club: clubName, interest }));
    } else {
      throw new Meteor.Error('At least one interest is required.');
    }
  },
});

const removeClubMethod = 'Clubs.remove';

/** Removes a club in the Clubs collection, and also removed the clubs interests in the ClubsInterest collection. */
Meteor.methods({
  'Clubs.remove'({ _id }) {
    const club = Clubs.collection.findOne({ _id });
    Clubs.collection.remove({ _id });
    if (club) {
      ClubsInterests.collection.remove({ club: club.clubName });
    }
  },
});

const addProfilesClubs = 'ProfilesClubs.add';

/** Creates a new project in the Projects collection, and also updates ProfilesProjects and ProjectsInterests. */
Meteor.methods({
  'ProfilesClubs.add'({ clubName, profileEmail }) {
    ProfilesClubs.collection.insert({ profileEmail: profileEmail, clubName: clubName });
  },
});

const addProfileAdmin = 'ProfilesAdmin.add';

Meteor.methods({
  'ProfilesAdmin.add'({ email }) {
    ProfilesAdmin.collection.insert({ email });
  },
});

const removeProfilesClubs = 'ProfilesClubs.remove';

/** Creates a new project in the Projects collection, and also updates ProfilesProjects and ProjectsInterests. */
Meteor.methods({
  'ProfilesClubs.remove'({ clubName, profileEmail }) {
    ProfilesClubs.collection.remove({ profileEmail, clubName });
  },
});

export { addProfileAdmin, createClubMethod, updateClubMethod, removeClubMethod, addProfilesClubs, removeProfilesClubs };
