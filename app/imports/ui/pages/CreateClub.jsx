import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Interests } from '../../api/interests/Interests';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { Clubs } from '../../api/clubs/Clubs';
import { ClubsInterests } from '../../api/clubs/ClubsInterests';
import { createClubMethod } from '../../startup/both/Methods';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  clubName: String,
  description: String,
  contact: String,
  interests: { type: Array, label: 'Interests', optional: false },
  'interests.$': { type: String, allowedValues: allInterests },
});

/* Renders the Page for adding a club. */
const CreateClub = () => {

  /* On submit, insert the data. */
  const submit = (data, formRef) => {
    Meteor.call(createClubMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Club created successfully', 'success').then(() => formRef.reset());
      }
    });
  };

  const { ready, interests } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Interests.userPublicationName);
    const sub2 = Meteor.subscribe(Clubs.userPublicationName);
    const sub3 = Meteor.subscribe(ClubsInterests.userPublicationName);

    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready(),
      interests: Interests.collection.find().fetch(),
    };
  }, []);

  let fRef = null;
  const allInterests = _.pluck(interests, 'name');
  const formSchema = makeSchema(allInterests);
  const bridge = new SimpleSchema2Bridge(formSchema);
  const transform = (label) => ` ${label}`;
  /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  return ready ? (
    <Container style={pageStyle}>
      <Row id={PageIDs.createClubPage} className="justify-content-center">
        <Col xs={6}>
          <Col className="text-center"><h2>Create Club</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={6}><TextField id={ComponentIDs.createClubFormName} label="Name of the club" name="clubName" showInlineError />
                    <TextField id={ComponentIDs.createClubFormContact} label="Contact" name="contact" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} id={ComponentIDs.createClubFormInterests}>
                    <SelectField label="Related interests: (Select that apply)" name="interests" showInlineError placeholder="Interests" multiple checkboxes transform={transform} />
                  </Col>
                  <LongTextField id={ComponentIDs.createClubFormDescription} label="Description" name="description" />
                </Row>
                <SubmitField id={ComponentIDs.createClubFormSubmit} value="Create Club" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default CreateClub;
