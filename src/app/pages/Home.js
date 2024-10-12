import React from 'react';
import { Container, Header, Content, Footer, Navbar, Nav } from 'rsuite';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container style={{ height: '100vh' }} >
      <Header>
        <Navbar appearance="inverse">
          <Navbar.Brand>Brand</Navbar.Brand>
          <Nav>
            <Nav.Item>Inicio</Nav.Item>
            <Nav.Item>Atualizações</Nav.Item>
            <Nav.Item>Produtos</Nav.Item>
            <Nav.Menu title="Sobre">
              <Nav.Item>Empresa</Nav.Item>
              <Nav.Item>Time</Nav.Item>
              <Nav.Item>Contate-nos</Nav.Item>
            </Nav.Menu>
          </Nav>
          <Nav pullRight>
            <Nav.Item as={Link} to="/LogIn">LogIn</Nav.Item>
            <Nav.Item as={Link} to="/SingUp">SingUp</Nav.Item>
          </Nav>
        </Navbar>
      </Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Container>
  );
}
