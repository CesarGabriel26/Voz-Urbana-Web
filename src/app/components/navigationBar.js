import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Avatar } from 'rsuite'
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/LogoOutile.png';
import DecodeToken from '../utils/JWT';

export default function NavigationBar() {
    const [userLogged, setUserLogged] = useState(false)
    const [User, setUser] = useState({})
    const navigate = useNavigate();

    const checkUser = async () => {
        let user = localStorage.getItem('usuario') || null;
        if (user) {
            let us = DecodeToken(user)
            setUser(us)
        }

        setUserLogged(user != null)
    };

    useEffect(() => { checkUser() }, []);

    return (

        <Navbar collapseOnSelect expand="sm" className='bg-primary' style={{ paddingLeft: 25, paddingRight: 25 }}>
            <Navbar.Toggle aria-controls="navBar" data-bs-target="#navBar" />
            <Navbar.Brand className='text-light'>
                <img src={logo} alt='logo Voz Urbana' style={{ width: 50, height: 50, marginRight: 10 }} />
                Voz Urbana
            </Navbar.Brand>
            <Navbar.Collapse id="navBar">
                <Nav style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }} className='d-block d-sm-flex'>
                    <Nav className='align-items-sm-center'>
                        <Nav.Link as={Link} to="/" className='text-light'>Inicio</Nav.Link>
                        {
                            /* 
                                <Nav.Link as={Link} to="/" className='light-text'>Abaixo Assinados</Nav.Link>
                                {
                                    userLogged ? (<Nav.Link as={Link} to="/" className='light-text'>Seus abaixo Assinados</Nav.Link>) : null
                                }
                                <Nav.Link as={Link} to="/Complaints" className='light-text'>Reclamaçõesa locis</Nav.Link>
                                {
                                    userLogged ? (<Nav.Link as={Link} to="/User-Complaint" className='light-text'>Suas reclamações</Nav.Link>) : null
                                } 
                                <Nav.Link eventKey="disabled" disabled className='light-text'>Disabled</Nav.Link> 
                            */
                        }

                        <NavDropdown title="Abaixo Assinados" style={{ marginLeft: 5 }} className='text-light' >
                            <NavDropdown.Item as={Link} to="/Abaixo-Assinados">
                                Abaixo Assinados
                            </NavDropdown.Item>
                            {
                                userLogged ? (
                                    <>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/Novo-Abaixo-Assinado">
                                            Novo abaixo assinado
                                        </NavDropdown.Item>

                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/Abaixo-Assinados-Do-Usuario">
                                            Meus abaixo ssinados
                                        </NavDropdown.Item>
                                        {/* 
                                            /Abaixo-Assinados-Detalhes
                                        */}
                                    </>
                                ) : null
                            }
                        </NavDropdown>

                        <NavDropdown title="Reclamações" style={{ marginLeft: 5 }} className='text-light' >
                            <NavDropdown.Item as={Link} to="/Complaints">
                                Reclamações locais
                            </NavDropdown.Item>
                            {
                                userLogged ? (
                                    <>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/New-Complaint">
                                            Nova reclamação
                                        </NavDropdown.Item>

                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/User-Complaint">
                                            MInhas reclamações
                                        </NavDropdown.Item>
                                    </>
                                ) : null
                            }
                        </NavDropdown>
                    </Nav>
                    {
                        !userLogged ? (
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
                                <NavDropdown.Item  as={Link} to="/profile" >
                                    Perfil
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => {
                                    localStorage.removeItem('usuario');
                                    navigate("/");
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
