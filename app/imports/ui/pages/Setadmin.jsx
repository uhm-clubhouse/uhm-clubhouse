import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
// eslint-disable-next-line no-unused-vars
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import {  PageIDs } from '../utilities/ids';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';
// eslint-disable-next-line no-unused-vars

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getAdminData(email) {
  const data = ProfilesAdmin.collection.find({ email });
  return _.extend(data);
}

/* Component for layout out a Club Card. */
const MakeCard = ({ emailB }) => {


  return (
    <Col xs={6}>
      <AutoForm>
      <Card className="h-100">
        <Card.Header>
          <Card.Title style={{ marginTop: '0px' }}>{emailB.email}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {emailB.email}
          </Card.Text>
        </Card.Body>
      </Card>
      </AutoForm>
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

  return ready ? (
    <Container id={PageIDs.setAdminPage} style={pageStyle}>
      <Row className="text-center">
        <h3>Admin Request</h3>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Setadmin;
