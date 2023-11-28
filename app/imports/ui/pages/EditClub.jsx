import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useParams } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { Clubs } from '../../api/clubs/Clubs';
import { ClubsInterests } from '../../api/clubs/ClubsInterests';
// import { updateClubMethod } from '../../startup/both/Methods';
import { Interests } from '../../api/interests/Interests';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  clubName: String,
  description: String,
  contact: String,
  interests: { type: Array, label: 'Interests', optional: false },
  'interests.$': { type: String, allowedValues: allInterests },
});

/* Renders the Page for adding a project. */
const EditClub = () => {

  const { _id } = useParams();
  const { ready, interests, clubData } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Interests.userPublicationName);
    const sub2 = Meteor.subscribe(Clubs.userPublicationName);
    const sub3 = Meteor.subscribe(ClubsInterests.userPublicationName);
    const clubInfo = Clubs.collection.findOne(_id);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready(),
      interests: Interests.collection.find().fetch(),
      clubData: clubInfo,
    };
  }, [_id]);
  /* On submit, insert the data. */
  const submit = (data, formRef) => {
    const { clubName, contact, description } = data;
    Clubs.collection.update({ clubName }, { $set: { clubName, contact, description } }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Club created successfully', 'success').then(() => formRef.reset());
      }
    });
    ClubsInterests.collection.remove({ club: clubName });
    interests.map((interest) => ClubsInterests.collection.insert({ club: clubName, interest }));
  };
  console.log('clubData:', clubData);
  let fRef = null;
  const allInterests = _.pluck(interests, 'name');
  const formSchema = makeSchema(allInterests);
  const bridge = new SimpleSchema2Bridge(formSchema);
  const transform = (label) => ` ${label}`;
  /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  return ready ? (
    <Container style={pageStyle}>
      <Row id={PageIDs.editClubPage} className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>Edit Club</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)} model={clubData}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={6}><TextField id={ComponentIDs.editClubFormName} label="Name of the club" name="clubName" showInlineError />
                    <TextField id={ComponentIDs.editClubFormContact} label="Contact" name="contact" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} id={ComponentIDs.editClubFormInterests}>
                    <SelectField label="Related interests: (Select that apply)" name="interests" showInlineError placeholder="Interests" multiple checkboxes transform={transform} />
                  </Col>
                  <LongTextField id={ComponentIDs.editClubFormDescription} label="Description" name="description" />
                </Row>
                <SubmitField id={ComponentIDs.editClubFormSubmit} value="Update Club" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditClub;
