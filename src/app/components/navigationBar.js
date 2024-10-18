import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

import logo from '../assets/LogoOutile.png';

export default function NavigationBar() {
    const [userLogged, setUserLogged] = useState(false)

    const checkUser = async () => {
        let user = localStorage.getItem('usuario') || null;
        setUserLogged(user != null)
    };
    useEffect(() => { checkUser() });

    return (

        <Navbar collapseOnSelect expand="sm" className='primary-bg' style={{ paddingLeft: 25, paddingRight: 25 }}>
            <Navbar.Toggle aria-controls="navBar" data-bs-target="#navBar" />
            <Navbar.Brand className='light-text'>
                <img src={logo} alt='logo Voz Urbana' style={{ width: 50, height: 50, marginRight: 10 }} />
                Voz Urbana
            </Navbar.Brand>
            <Navbar.Collapse id="navBar">
                <Nav style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }} className='d-block d-sm-flex'>
                    <Nav className='align-items-sm-center'>
                        <Nav.Link as={Link} to="/" className='light-text'>Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/" className='light-text'>Abaixo Assinados</Nav.Link>
                        {
                            userLogged? (<Nav.Link as={Link} to="/" className='light-text'>Seus abaixo Assinados</Nav.Link>) : null
                        }
                        <Nav.Link as={Link} to="/Complaints" className='light-text'>Reclamações locais</Nav.Link>
                        {
                            userLogged? (<Nav.Link as={Link} to="/User-Complaint" className='light-text'>Suas reclamações</Nav.Link>) : null
                        }
                        {/* <Nav.Link eventKey="disabled" disabled className='light-text'>Disabled</Nav.Link> */}
                    </Nav>
                    {
                        !userLogged ? (
                            <Nav className='align-items-sm-center'>
                                <Nav.Link as={Link} to="/LogIn" className='light-text'>LogIn</Nav.Link>
                                <Nav.Link as={Link} to="/SignUp" className='light-text'>SignUp</Nav.Link>
                            </Nav>
                        ) : (
                            <NavDropdown title="Configurações" style={{ marginRight: 50 }} className='light-text' >
                                <NavDropdown.Item href="#action/3.1">
                                    Action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">
                                    Something
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={()=>{
                                    localStorage.removeItem('usuario');
                                    window.location.reload();
                                }} >
                                    Sair
                                </NavDropdown.Item>
                            </NavDropdown>
                        )
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
