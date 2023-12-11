import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
// eslint-disable-next-line no-unused-vars
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { PageIDs } from '../utilities/ids';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';
// eslint-disable-next-line no-unused-vars

/* Gets the Request data */
function getAdminData(email) {
  const data = ProfilesAdmin.collection.findOne({ email });
  const requests = _.pluck(ProfilesAdmin.collection.find({ email: email }).fetch(), 'email');
  return _.extend({}, data, { requests });
}

/* Component for layout out a Request Card. */
const MakeCard = ({ request }) => {
  const [visible, setVisible] = useState(true);

  const handleHide = () => {
    setVisible(false);
  };

  return (
    visible && (
      <Col xs={4}>
        <Card className="h-100">
          <Card.Header>
            <Button onClick={handleHide}>
              Hide
            </Button>
          </Card.Header>
          <Card.Body>
            <Card.Text>{request.email} is requesting to be an admin.</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    )
  );
};

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
      <Row className="text-center">
        {/* eslint-disable-next-line react/no-unescaped-entities,max-len */}
        <h5>Instructions: To make someone an admin please email them with sadmin@foo.com email for password. Once the username and password are gained, place their account in "defaultAccounts" data located in the app directory, inside the .deploy folder, within the settings.json file using the same structure as the other default accounts with its role set to admin. Using IntelliJ, open the console and change to .deploy directory. Use mup stop, mup setup, and then mup deploy to update the user role.</h5>
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
