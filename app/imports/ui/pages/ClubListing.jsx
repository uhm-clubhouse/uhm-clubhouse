import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
// eslint-disable-next-line no-unused-vars
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Interests } from '../../api/interests/Interests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { Clubs } from '../../api/clubs/Clubs';
import { ClubsInterests } from '../../api/clubs/ClubsInterests';
import { ProfilesClubs } from '../../api/profiles/ProfilesClubs';
import { addProfilesClubs, removeProfilesClubs } from '../../startup/both/Methods';
// eslint-disable-next-line no-unused-vars

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getClubData(clubName) {
  const data = Clubs.collection.findOne({ clubName });
  const interests = _.pluck(ClubsInterests.collection.find({ club: clubName }).fetch(), 'interest');
  return _.extend({}, data, { interests });
}

/* Component for layout out a Club Card. */
const MakeCard = ({ club }) => {
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
      Meteor.call(removeProfilesClubs, { clubName, profileEmail }, displayError);
    } else {
      Meteor.call(addProfilesClubs, { clubName, profileEmail }, displayError);
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
    _id: PropTypes.string,
  }).isRequired,
};

const ClubListing = () => {
  const { ready, interests } = useTracker(() => {
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(ClubsInterests.userPublicationName);
    const sub3 = Meteor.subscribe(Interests.userPublicationName);
    const sub4 = Meteor.subscribe(ProfilesClubs.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
      interests: Interests.collection.find().fetch(),
      profilesClubs: ProfilesClubs.collection.find().fetch(),
    };
  }, []);

  const clubs = _.pluck(Clubs.collection.find().fetch(), 'clubName');
  const clubData = clubs.map(club => getClubData(club));
  console.log(clubData);
  const allInterests = _.pluck(interests, 'name');
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [query, setQuery] = useState('');
  const handleInterestSelect = (interest) => {
    setSelectedInterest(interest);
  };
  const handleSearch = event => {
    const { value } = event.target;
    setQuery(value.toLowerCase());
  };
  const filteredInterest = selectedInterest ? clubData.filter(club => club.interests.includes(selectedInterest)) : clubData;
  const searchClubs = query ? filteredInterest.filter(club => club.clubName.toLowerCase().includes(query) || club.description.toLowerCase().includes(query)) : filteredInterest;

  return ready ? (
    <Container id={PageIDs.clubsPage} style={pageStyle}>
      <Nav className="justify-content-end">
        <li className="px-2">
          <NavDropdown title={selectedInterest ? `Filter by ${selectedInterest}` : 'Filter by Interest'} id={ComponentIDs.clubListingFilter}>
            <NavDropdown.Item onClick={() => handleInterestSelect(null)} id={ComponentIDs.clubListingShowAll}>Show All</NavDropdown.Item>
            {allInterests.map(interest => (<NavDropdown.Item key={interest} onClick={() => handleInterestSelect(interest)} id={ComponentIDs.clubListingFilterDropdown}>{interest}</NavDropdown.Item>))}
          </NavDropdown>
        </li>
        <li className="px-2">
          <input id={ComponentIDs.clubListingSearch} type="text" placeholder="Search" onChange={handleSearch} />
        </li>
      </Nav>

      <Row className="text-center">
        <h3>Club Listing</h3>
      </Row>
      <Row xs={1} md={2} lg={4} className="g-2 justify-content-center">
        {searchClubs.map((club, index) => <MakeCard key={index} club={club} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ClubListing;
