import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
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

/* Component for layout out a Profile Card. */
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
const ClubsPage = () => {
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
  return ready ? (
    <Container id={PageIDs.clubsPage} style={pageStyle}>
      <Row xs={1} md={2} lg={4} className="g-2">
        {clubData.map((club, index) => <MakeCard key={index} club={club} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ClubsPage;
