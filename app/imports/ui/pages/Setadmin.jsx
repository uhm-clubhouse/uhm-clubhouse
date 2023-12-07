import React from 'react';
import { Container, Nav, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
// eslint-disable-next-line no-unused-vars
import { _ } from 'meteor/underscore';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';
import { Interests } from '../../api/interests/Interests';
import { ProfilesAdmin } from '../../api/profiles/ProfilesAdmin';

const Setadmin = () => {
  const { ready } = useTracker(() => {
    const sub1 = Meteor.subscribe(ProfilesAdmin.userPublicationName);
    return {
      ready: sub1.ready(),
      interests: Interests.collection.find().fetch(),
      profilesClubs: ProfilesAdmin.collection.find().fetch(),
    };
  }, []);

  return ready ? (
    <Container id={PageIDs.clubsPage} style={pageStyle}>
      <Nav className="justify-content-end">
        <li className="px-2">
          <input id={ComponentIDs.clubListingSearch} type="text" placeholder="Search" />
        </li>
      </Nav>

      <Row className="text-center">
        <h3>Admin Requests</h3>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Setadmin;
