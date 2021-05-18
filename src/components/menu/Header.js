import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logoBlack from '../../assets/images/logoBlack.svg';
import globalConsts from '../../globalConsts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

// Reactstrap components
import {
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from 'reactstrap';

const Header = (props) => {

  const { chosenCompanyHeader } = props;

  const [userCompanies, setUserCompanies] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chosenCompany, setChosenCompany] = useState({
    id: '0',
    name: 'Alle opgaver',
  });
  const [fetchedCompanies, setFetchedCompanies] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    let isMounted = true;
    if (userCompanies.length === 0 && !fetchedCompanies) {
      var wordPressID = localStorage.getItem('ID');
      var wordPressToken = localStorage.getItem('token');
      const userData = new FormData();
      userData.append('id', wordPressID);
      userData.append('token', wordPressToken);
      axios({
        method: 'POST',
        url: `${globalConsts[0]}/users/me.php`,
        data: userData,
      })
        .then((response) => {
          if (isMounted) {
            setFetchedCompanies(true);
            const companyArray = response.data.companies;
            if (companyArray !== undefined) {
              setUserCompanies(companyArray);
            }
            chosenCompanyHeader({
              id: '0',
              name: 'Alle firmaer',
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [chosenCompanyHeader, userCompanies, fetchedCompanies])

  const handleChosenCompany = (e) => {
    e.preventDefault();
    setChosenCompany({ id: e.target.value, name: e.target.name });
    chosenCompanyHeader({ id: e.target.value, name: e.target.name }, false);
  };

  return (
    <Container className="headerContainerContainer">
      <Row>
        <Col className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-xs-6 col-6">
          <Link to={'/tasks'}>
            <img
              className="holder100Image"
              src={logoBlack}
              alt="Holder100 logo"
            />
          </Link>
        </Col>
        <Col className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-xs-6 col-6 dropdownCol">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            className="dropdownStyles dropdownStylesHeader"
          >
            <DropdownToggle>
              {userCompanies !== '' && chosenCompany.name}{' '}
              <FontAwesomeIcon
                className="fontAwesomeIconHeader"
                icon={faCaretDown}
              ></FontAwesomeIcon>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                className="mb-2 mt-1"
                name="Alle opgaver"
                value="0"
                onClick={(e) => handleChosenCompany(e)}
              >
                Alle opgaver
              </DropdownItem>
              {userCompanies !== '' &&
                userCompanies.map((company, index) => (
                  <DropdownItem
                    key={index}
                    className="mb-2 mt-1"
                    name={company.name}
                    value={company.id}
                    onClick={(e) => handleChosenCompany(e)}
                  >
                    {company.name}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};
export default Header;
