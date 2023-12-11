import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
// eslint-disable-next-line no-unused-vars
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';
// eslint-disable-next-line no-unused-vars

/* Gets the Clubs data as well as the Interests associated with the passed Clubs name. */
function getAdminData(email) {
  const data = ProfilesAdmin.collection.findOne({ email });
  const requests = _.pluck(ProfilesAdmin.collection.find({ email: email }).fetch(), 'email');
  return _.extend({}, data, { requests });
}

/* Component for layout out a Club Card. */
const MakeCard = ({ request }) => (
  <Col xs={4}>
    <Card className="h-100">
      <Card.Header>
        <Card.Title style={{ marginTop: '0px' }}>{request.email}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>
          {request.email} is requesting to be an admin.
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

MakeCard.propTypes = {
  request: PropTypes.shape({
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
  const requests = _.pluck(ProfilesAdmin.collection.find().fetch(), 'email');
  const requestData = requests.map(request => getAdminData(request));
  console.log(requestData);
  console.log(requests);
  return ready ? (
    <Container id={PageIDs.setAdminPage} style={pageStyle}>
      <Row className="text-center">
        <h3>Admin Request</h3>
      </Row>
      <Row className="g-2 justify-content-center">
        {requestData.map((request, index) => (
          <MakeCard key={index} request={request} />
        ))}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Setadmin;
