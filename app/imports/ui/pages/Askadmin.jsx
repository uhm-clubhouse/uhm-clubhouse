import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, TextField, SubmitField, ErrorsField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
// eslint-disable-next-line no-unused-vars
import { _ } from 'meteor/underscore';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';
// eslint-disable-next-line import/named
import { addProfileAdmin } from '../../startup/both/Methods';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = () => new SimpleSchema({
  email: String,
});

/* Renders the Page for adding a project. */
const Askadmin = () => {

  /* On submit, insert the data. */
  const submit = (data, formRef) => {
    Meteor.call(addProfileAdmin, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Club created successfully', 'success').then(() => formRef.reset());
      }
    });
  };

  const { ready } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(ProfilesAdmin.userPublicationName);

    return {
      ready: sub1.ready(),
      profile: ProfilesAdmin.collection.find().fetch(),
    };
  }, []);

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
          <Col className="text-center"><h2>Type in the email associated with the account you want to make an admin.</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={6}><TextField id={ComponentIDs.setAdminEmail} label="Email" name="email" showInlineError />
                  </Col>
                </Row>
                <SubmitField id={ComponentIDs.setAdminFormSubmit} value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Askadmin;
