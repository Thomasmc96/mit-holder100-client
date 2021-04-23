import React, { useState } from 'react';
import Menu from './Menu';
import Tasks from './Tasks';
import Information from './Information';
import ChangePassword from './ChangePassword';
import './Home.css';

// Reactstrap components
import { Container, Row, Col } from 'reactstrap';

const Home = () => {

  const [chosenMenuPage, setChosenMenuPage] = useState('');

  const handleMenuPage = (childData) => {
    setChosenMenuPage(childData);
  }

  return (
    <Container className="contentWrapper">
      <Row>
        <Col lg="3">
          <Menu selectedMenuPage={handleMenuPage} />
        </Col>
        <Col>
          <Container className="homeContainer">
            {(chosenMenuPage === 'Tasks' || chosenMenuPage === '') &&
              <Tasks />
            }
            {chosenMenuPage === 'ChangePassword' &&
              <ChangePassword />
            }
            {chosenMenuPage === 'Information' &&
              <Information />
            }
          </Container>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
