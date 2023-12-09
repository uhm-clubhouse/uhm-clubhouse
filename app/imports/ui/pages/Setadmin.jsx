import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Row, Col, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
// eslint-disable-next-line no-unused-vars
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';
// eslint-disable-next-line no-unused-vars

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getAdminData(email) {
  const data = ProfilesAdmin.collection.find({ email });
  return _.extend({}, data);
}

/* Component for layout out a Club Card. */
const MakeCard = ({ emailB }) => {
  const displayError = (error, result) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Document removed:', result);
    }
  };

  return (
    <Col>
      <Card className="h-100">
        <Card.Header>
          <Card.Title style={{ marginTop: '0px' }}>{emailB.email}</Card.Title>
        </Card.Header>
        <Card.Body>
        </Card.Body>
      </Card>
    </Col>
  );
};

MakeCard.propTypes = {
  emailB: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};

const Setadmin = () => {
  const { ready } = useTracker(() => {
    const sub1 = Meteor.subscribe(ProfilesAdmin.userPublicationName);
    return {
      ready: sub1.ready(),
      profilesClubs: ProfilesAdmin.collection.find().fetch(),
    };
  }, []);

  const clubs = _.pluck(ProfilesAdmin.collection.find().fetch(), 'Email');
  const clubData = clubs.map(email => getAdminData(email));


  return ready ? (
    <Container id={PageIDs.setAdminPage} style={pageStyle}>
      <Row className="text-center">
        <h3>Admin Request</h3>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Setadmin;
