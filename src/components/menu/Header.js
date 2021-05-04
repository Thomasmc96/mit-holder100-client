import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoBlack from '../../assets/images/logoBlack.svg';

// Reactstrap components
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Col,
} from 'reactstrap';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(!dropdownOpen);

    return (
        <React.Fragment>
            <Row>
                <Col className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-xs-6 col-6">
                    <Link to={'/home'}>
                        <img className="holder100Image" src={logoBlack} alt="Holder100 logo" />
                    </Link>
                </Col>
                <Col className="col-xl-12 col-lg-12 col-md-6 col-sm-6 col-xs-6 col-6 dropdownCol">
                    <Dropdown isOpen={dropdownOpen} toggle={toggle} className="dropdownStyles">
                        <DropdownToggle caret>Firma 1</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem className="mb-3">Firma 1</DropdownItem>
                            <DropdownItem className="mb-3">Firma 2</DropdownItem>
                            <DropdownItem className="mb-3">Firma 3</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
        </React.Fragment>
    );
};
export default Header;