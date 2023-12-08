import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class ProfilesClubsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'ProfilesClubsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      profileEmail: String,
      clubName: String,
      joinedClub: {
        type: Boolean,
        defaultValue: false,
      },
      // Other fields for joined club information, if applicable
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }

  // Insert a new document with joined club information
  insert(profileEmail, clubName, joinedClub = false) {
    return this.collection.insert({ profileEmail, clubName, joinedClub });
  }

  // Update the joined club list information for a document
  update(documentId, joinedClub) {
    this.collection.update({ _id: documentId }, { $set: { joinedClub } });
  }

  // Add a joined club
  addJoinedClub(profileEmail, clubName) {
    // Check if the club already exists
    const existingJoinedClub = this.collection.findOne({ profileEmail, clubName });
    if (existingJoinedClub) {
      // If club already exists, update the joined club field
      this.update(existingJoinedClub._id, true);
    } else {
      // If club doesn't exist, insert a new document with joined club information
      this.insert(profileEmail, clubName, true);
    }
  }

  // Remove a joined club
  removeJoinedClub(profileEmail, clubName) {
    // Check if the joined club exists
    const existingJoinedClub = this.collection.findOne({ profileEmail, clubName });
    if (existingJoinedClub) {
      // If joined club exists, update the joined club field
      this.update(existingJoinedClub._id, false);
    }
  }
}
export const ProfilesClubs = new ProfilesClubsCollection();
