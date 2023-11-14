import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PageIDs.landingPage}>
    <div className="landing-green-background">
      <Container className="text-center">
        <h1 style={{ paddingTop: '20px', color: 'white', fontSize: '36pt' }}>
          Welcome to UHM ClubHouse
        </h1>
        <h3 style={{ paddingBottom: '20px', color: 'white' }}>
          Browse through all the clubs that UH Manoa has to offer
        </h3>
      </Container>
    </div>
    <div className="landing-white-background">
      <Container className="justify-content-center text-center">
        <h2 style={{ color: '#100f0f', paddingBottom: '30px' }}>Get started by first making your profile:</h2>
        <button
          type="button"
          className="btn btn-primary fw-bold"
          style={{
            fontSize: '24pt',
            borderRadius: '0',
            marginBottom: '30px',
            color: '#000',
            backgroundColor: '#fff',
            border: '2px solid #000',
            padding: '20px 50px',
          }}
        >
          Sign Up
        </button>
      </Container>
    </div>
    <div className="landing-green-background">
      <Container className="justify-content-center text-center">
        <h2 style={{ color: 'white' }}>...then find and choose your clubs</h2>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/add-project-page.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/projects-page.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-white-background text-center">
      <h2 style={{ color: '#100f0f' }}>
        Connect to people and projects with shared interests!
      </h2>
      <Container>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/interests-page.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/filter-page.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
  </div>
);

export default Landing;
