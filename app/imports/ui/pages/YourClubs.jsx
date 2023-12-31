import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col, Badge, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { Clubs } from '../../api/clubs/Clubs';
import { ClubsInterests } from '../../api/clubs/ClubsInterests';
import { Interests } from '../../api/interests/Interests';
import { removeClubMethod } from '../../startup/both/Methods';

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getClubData(clubName) {
  const data = Clubs.collection.findOne({ clubName });
  const interests = _.pluck(ClubsInterests.collection.find({ club: clubName }).fetch(), 'interest');
  // Remove "club" from each interest in the array
  const cleanedInterests = interests.map(interest => interest.replace(/club/i, ''));
  return _.extend({}, data, { interests: cleanedInterests });
}

/* Component for layout out a Club Card. */
const MakeCard = ({ club }) => {
  const removeClub = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once removed, you will not be able to restore this club.',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          Meteor.call(removeClubMethod, { _id: club._id }, (error) => {
            if (error) {
              swal('Error', error.message, 'error');
            } else {
              swal('Success', 'Club removed successfully', 'success');
            }
          });
        }
      });
  };
  // Access cleanedInterests directly from the getClubData function
  const cleanedInterests = getClubData(club.clubName).interests;
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
            {cleanedInterests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
            <br />
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Row><Col />
            <Col>
              <Button
                id={ComponentIDs.yourClubsDelete}
                className="btn btn-danger btn-sm"
                onClick={removeClub}
                key="clubs"
              >Delete
              </Button>
            </Col>
            <Col>
              <Link
                id={ComponentIDs.yourClubsEdit}
                className="btn btn-primary btn-sm"
                to={`/editclub/${club._id}`}
                key="clubs"
              >Edit
              </Link>
            </Col>
            <Col />
          </Row>
        </Card.Footer>
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

/* Renders the Clubs Collection as a set of Cards. */
const YourClubs = () => {
  const { ready, interests } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(ClubsInterests.userPublicationName);
    const sub3 = Meteor.subscribe(Interests.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready(),
      interests: Interests.collection.find().fetch(),
    };
  }, []);
  const clubs = _.pluck(Clubs.collection.find().fetch(), 'clubName');
  const clubData = clubs.map(club => getClubData(club));
  const allInterests = _.pluck(interests, 'name');
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [query, setQuery] = useState('');
  /* Handles the interest filter and search function */
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
    <Container id={PageIDs.yourClubsPage} style={pageStyle}>
      <Nav className="justify-content-end">
        <li className="px-2">
          <NavDropdown title={selectedInterest ? `Filter by ${selectedInterest}` : 'Filter by Interest'} id="filter">
            <NavDropdown.Item onClick={() => handleInterestSelect(null)}>Show All</NavDropdown.Item>
            {allInterests.map(interest => (<NavDropdown.Item key={interest} onClick={() => handleInterestSelect(interest)}>{interest}</NavDropdown.Item>))}
          </NavDropdown>
        </li>
        <li className="px-2">
          <input type="text" placeholder="Search" onChange={handleSearch} />
        </li>
      </Nav>
      <Row className="text-center">
        <h3>Your Clubs</h3>
      </Row>
      <Row xs={1} md={2} lg={4} className="g-2 justify-content-center">
        {searchClubs.map((club, index) => <MakeCard key={index} club={club} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default YourClubs;
