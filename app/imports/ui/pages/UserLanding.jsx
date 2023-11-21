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

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getClubData(clubName) {
  const data = Clubs.collection.findOne({ clubName });
  const interests = _.pluck(ClubsInterests.collection.find({ club: clubName }).fetch(), 'interest');
  return _.extend({}, data, { interests });
}

/* Component for laying out a Club Card. */
const MakeCard = ({ club }) => (
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
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  club: PropTypes.shape({
    description: PropTypes.string,
    clubName: PropTypes.string,
    contact: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

/* Renders the Project Collection as a set of Cards. */
const UserLanding = () => {
  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(ClubsInterests.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready(),
    };
  }, []);
  const clubs = _.pluck(Clubs.collection.find().fetch(), 'clubName');
  const clubData = clubs.map(club => getClubData(club));

  // State to manage selected club in the sidebar
  const [selectedClub, setSelectedClub] = useState(null);

  const abbreviateClubName = (clubName) => {
    const maxLength = 20; // Updated maximum length
    return clubName.length > maxLength ? `${clubName.slice(0, maxLength)}...` : clubName;
  };

  return ready ? (
    <Container fluid id={PageIDs.clubsPage} style={pageStyle}>
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
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {clubData.map((club, index) => (
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
        </Col>

        {/* Main Content */}
        <Col xs={9} md={10} style={{ paddingLeft: '15px', paddingTop: '15px' }}> {/* Added padding to the left and top */}
          {selectedClub ? (
            <MakeCard key={selectedClub.clubName} club={selectedClub} />
          ) : (
            <>
              <h1>Following Clubs</h1>
              <Row xs={1} md={2} lg={4} className="g-2">
                {clubData.map((club, index) => <MakeCard key={index} club={club} />)}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default UserLanding;
