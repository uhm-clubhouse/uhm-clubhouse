import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  const menuStyle = { marginBottom: '0px', background: '#f6f6f6' };
  return (
    <Navbar expand="lg" style={menuStyle}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '24px' }}><Image src="/images/uhm-clubhouse-logo.png" width={100} style={{ marginBottom: 3 }} /> UHM Clubhouse</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              [<Nav.Link as={NavLink} id={ComponentIDs.homeMenuItem} to="/home" key="home">Home</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.adminRequestItem} to="/ask" key="ask">Admin Request Form</Nav.Link>]
            ) : ''}
            <Nav.Link as={NavLink} id={ComponentIDs.clubsMenuItem} to="/listing" key="list">Club Listing</Nav.Link>
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              [<Nav.Link as={NavLink} id={ComponentIDs.yourClubsMenuItem} to="/yourclubs" key="clubs">Your Clubs</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.createClubMenuItem} to="/createclub" key="create">Create Club</Nav.Link>]
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'manage-users') ? (
              [<Nav.Link as={NavLink} id={ComponentIDs.yourClubsMenuItem} to="/yourclubs" key="clubs">Your Clubs</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.createClubMenuItem} to="/createclub" key="create">Create Club</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.setAdminMenuItem} to="/setadmin" key="set">Admin Requests</Nav.Link>]
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={ComponentIDs.loginDropdown} title="Login">
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} as={NavLink} to="/signin">
                  <PersonFill />
                  Sign
                  in
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign
                  up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id={ComponentIDs.currentUserDropdown} title={currentUser}>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default NavBar;
