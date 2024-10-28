import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer } from 'rsuite';
import NavigationBar from '../components/navigationBar';

export default function BaseContainer({ children, flex = false, footer = true }) {
    const [isSticky, setIsSticky] = useState(false);

    const handleScroll = () => {
        setIsSticky(window.scrollY > 50);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Container style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    position: isSticky ? 'fixed' : 'relative',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    boxShadow: isSticky ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                    transition: 'box-shadow 0.3s ease-in-out',
                }}
            >
                <NavigationBar />
            </Header>

            <Content style={{ paddingTop: isSticky ? 80 : 0, display: flex ? 'flex' : '' }}>
                {children}
            </Content>

            {
                footer ? (
                    <Footer style={{ textAlign: 'center', padding: 20 }}>
                        &copy; 2024 Sua Aplicação. Todos os direitos reservados.
                    </Footer>
                ) : null
            }
        </Container>
    );
}
