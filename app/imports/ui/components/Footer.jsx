import React from 'react';
import { Col, Container } from 'react-bootstrap';

/* The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="footer mt-auto py-3 bg-dark">
    <Container>
      <Col className="text-center" style={{ color: 'black' }}>
        UHM Clubhouse
        {' '}
        <br />
        University of Hawaii
        <br />
        Honolulu, HI 96822
        {' '}
        <br />
        <a style={{ color: 'blue' }} href="https://uhm-clubhouse.github.io/">https://uhm-clubhouse.github.io/</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
