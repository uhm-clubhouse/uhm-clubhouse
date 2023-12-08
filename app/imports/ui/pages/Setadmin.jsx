import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { AutoForm, ErrorsField } from 'uniforms-bootstrap5';
import LoadingSpinner from '../components/LoadingSpinner';



/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = () => new SimpleSchema({
  email: String,
});

/* Renders the Page for adding a project. */
const Setadmin = () => {

  /* On submit, insert the data. */
  function getProfilesAdmin(email) {
    const data = ProfilesAdmin.collection.find({ email });
    return _.extend({}, data);
  }

  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesAdmin.userPublicationName);

    return {
      ready: sub1.ready(),
      profile: ProfilesAdmin.collection.find().fetch(),
    };
  }, []);

  const emails = _.pluck(ProfilesAdmin.collection.find().fetch(), 'email');
  const emailData = emails.map(email => getProfilesAdmin(email));

  let fRef = null;
  const formSchema = makeSchema();
  const bridge = new SimpleSchema2Bridge(formSchema);
  // eslint-disable-next-line no-unused-vars
  const transform = (label) => ` ${label}`;
  /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  return ready ? (
    <Container style={pageStyle} id={PageIDs.askAdminPage}>
      <Row className="justify-content-center">
        <Col xs={6}>
          <Col className="text-center"><h2>List of Admin Request.</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                  </Col>
                </Row>
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};
export default Setadmin;
