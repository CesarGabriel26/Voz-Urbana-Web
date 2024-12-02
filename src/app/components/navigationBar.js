import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Avatar } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/LogoOutile.png';
import DecodeToken from '../utils/JWT';

export default function NavigationBar() {
    const [userLogged, setUserLogged] = useState(false);
    const [User, setUser] = useState({});
    const navigate = useNavigate();

    const checkUser = async () => {
        let user = localStorage.getItem('usuario') || null;
        if (user) {
            let us = DecodeToken(user);
            setUser(us);
        }
        setUserLogged(user != null);
    };

    useEffect(() => { checkUser(); }, []);

    return (
        <Navbar collapseOnSelect expand="sm" className='bg-primary text-light' style={{ paddingLeft: 25, paddingRight: 25 }}>
            <Navbar.Toggle aria-controls="navBar" data-bs-target="#navBar" />
            <Navbar.Brand as={Link} to="/" className='text-light '>
                <div className='d-flex d-none d-sm-block'>
                    <img src={logo} alt='logo Voz Urbana' style={{ width: 50, height: 50, marginRight: 10 }} />
                    Voz Urbana
                </div>
                {
                    userLogged ? (
                        <Avatar
                            className='d-block d-md-none'
                            src={User.pfp}
                            size="lg"
                            circle
                            alt='User Profile'
                            as={Link}
                            to="/profile"
                        />
                    ) : null
                }

            </Navbar.Brand>
            <Navbar.Collapse id="navBar">
                <Nav style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }} className='d-block d-sm-flex'>
                    <Nav className='align-items-sm-center'>
                        <Nav.Link as={Link} to="/" className='text-light'>Inicio</Nav.Link>

                        <NavDropdown title="Abaixo Assinados" style={{ marginLeft: 5 }} className='text-light'>
                            <NavDropdown.Item as={Link} to="/Abaixo-Assinados">
                                Abaixo Assinados
                            </NavDropdown.Item>
                            {userLogged && (
                                <>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/Novo-Abaixo-Assinado">
                                        Novo abaixo assinado
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/Abaixo-Assinados-Do-Usuario">
                                        Meus abaixo assinados
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>

                        <NavDropdown title="Reclamações" style={{ marginLeft: 5 }} className='text-light'>
                            <NavDropdown.Item as={Link} to="/Complaints">
                                Reclamações locais
                            </NavDropdown.Item>
                            {userLogged && (
                                <>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/New-Complaint">
                                        Nova reclamação
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/User-Complaint">
                                        Minhas reclamações
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                    </Nav>
                    {!userLogged ? (
                        <Nav className='align-items-sm-center'>
                            <Nav.Link as={Link} to="/LogIn" className='text-light'>LogIn</Nav.Link>
                            <Nav.Link as={Link} to="/SignUp" className='text-light'>SignUp</Nav.Link>
                        </Nav>
                    ) : (
                        <NavDropdown
                            title={
                                <Avatar
                                    src={User.pfp}
                                    size="lg"
                                    circle
                                    alt='User Profile'
                                />
                            }
                            style={{ marginRight: 50 }}
                            className='light-text custom-dropdown d-none d-md-block'
                        >
                            <NavDropdown.Item as={Link} to="/profile">
                                Perfil
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => {
                                localStorage.removeItem('usuario');
                                navigate("/");
                                window.location.reload();
                            }}>
                                Sair
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
