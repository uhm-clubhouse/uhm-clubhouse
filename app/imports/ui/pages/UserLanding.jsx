import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import { Clubs } from '../../api/clubs/Clubs';
import { ClubsInterests } from '../../api/clubs/ClubsInterests';
import { ProfilesClubs } from '../../api/profiles/ProfilesClubs';
import { addProfilesClubs, removeProfilesClubs } from '../../startup/both/Methods';

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getProfileClubData(clubName) {
  const data = ProfilesClubs.collection.findOne({ clubName });
  const clubData = Clubs.collection.findOne({ clubName });
  const interests = _.pluck(ClubsInterests.collection.find({ club: clubName }).fetch(), 'interest');
  return _.extend({}, data, clubData, { interests });
}

/* Component for laying out a Club Card. */
const MakeCard = ({ club, updateClubList }) => {
  const displayError = (error, result) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Document removed:', result);
    }
  };
  const joinedClub = (status) => {
    const clubName = club.clubName;
    const profileEmail = Meteor.user().username;
    if (status === 'remove') {
      Meteor.call(removeProfilesClubs, { clubName, profileEmail }, (error, result) => {
        displayError(error, result);
        // Update the club list after successful removal
        updateClubList();
      });
    } else {
      Meteor.call(addProfilesClubs, { clubName, profileEmail }, (error, result) => {
        displayError(error, result);
        // Update the club list after successful addition
        updateClubList();
      });
    }
  };

  const buttonDisplay = () => {
    if (Meteor.userId()) {
      const profileEmail = Meteor.user().username;
      const isJoined = _.pluck(ProfilesClubs.collection.find({ profileEmail }).fetch(), 'clubName').includes(club.clubName);

      return (
        <Button
          id="join-button"
          variant="outline-secondary"
          type="button"
          onClick={() => joinedClub(isJoined ? 'remove' : 'add')}
        >
          {isJoined ? 'Leave' : 'Join'}
        </Button>
      );
    }
    return null;
  };

  return (
    <Col>
      <Card className="h-100">
        <Card.Header>
          <Card.Title style={{ marginTop: '0px' }}>{club.clubName}</Card.Title>
          <Card.Subtitle><span className="date">{club.contact}</span></Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {club.description}
            <br />
            {club.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-end">
            {buttonDisplay()}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

MakeCard.propTypes = {
  club: PropTypes.shape({
    description: PropTypes.string,
    clubName: PropTypes.string,
    contact: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  updateClubList: PropTypes.func.isRequired, // Function to update the club list
};

/* Renders the Project Collection as a set of Cards. */
const UserLanding = () => {
  // eslint-disable-next-line no-unused-vars
  const [clubDataState, setClubData] = useState([]); // Rename state variable to clubDataState
  const { ready, user } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(ClubsInterests.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesClubs.userPublicationName);

    // eslint-disable-next-line no-shadow
    const user = Meteor.user();

    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready(),
      user,
    };
  }, []);
  const profileEmail = user?.username; // Retrieve the user's email

  const clubs = _.pluck(ProfilesClubs.collection.find({ profileEmail }).fetch(), 'clubName');
  const localClubData = clubs.map(clubName => getProfileClubData(clubName)); // Rename local variable to localClubData
  // State to manage selected club in the sidebar
  const [selectedClub, setSelectedClub] = useState(null);

  const abbreviateClubName = (clubName) => {
    const maxLength = 20; // Updated maximum length
    return clubName.length > maxLength ? `${clubName.slice(0, maxLength)}...` : clubName;
  };

  const updateClubList = () => {
    // Fetch the updated list of clubs after a club is added or removed
    const updatedClubs = _.pluck(ProfilesClubs.collection.find({ profileEmail }).fetch(), 'clubName');
    const updatedClubData = updatedClubs.map(clubName => getProfileClubData(clubName));
    setClubData(updatedClubData);
  };

  return ready ? (
    <Container fluid id={PageIDs.homePage} style={pageStyle}>
      <Row>
        {/* Sidebar */}
        <Col xs={3} md={2} style={{ maxWidth: '215px', borderRight: '1px solid #ccc', height: '100vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: '15px', paddingTop: '15px' }}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
          <h2
            onClick={() => setSelectedClub(null)} // Set selectedClub to null when heading is clicked
            style={{ cursor: 'pointer' }}
          >
            Club List
          </h2>
          {localClubData.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {localClubData.map((club, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <Button
                    variant="light"
                    block
                    onClick={() => setSelectedClub(club)}
                    active={selectedClub && selectedClub.clubName === club.clubName}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '10px' }}
                  >
                    {abbreviateClubName(club.clubName)}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No joined clubs</p>
          )}
        </Col>

        {/* Main Content */}
        <Col xs={9} md={10} style={{ paddingLeft: '15px', paddingTop: '15px' }}> {/* Added padding to the left and top */}
          {selectedClub ? (
            <MakeCard key={selectedClub.clubName} club={selectedClub} updateClubList={updateClubList} />
          ) : (
            <>
              <h1>Joined Clubs</h1>
              <Row xs={1} md={2} lg={4} className="g-2">
                {localClubData.map((club, index) => (
                  <MakeCard key={index} club={club} updateClubList={updateClubList} />
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default UserLanding;
