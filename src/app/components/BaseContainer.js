import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer } from 'rsuite';
import NavigationBar from '../components/navigationBar';

export default function BaseContainer({ children, flex = false, footer = true, style }) {
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
                className={isSticky ? 'sticky-header' : ''}
            >
                <NavigationBar />
            </Header>

            <Content style={{ paddingTop: isSticky ? 80 : 0, display: 'flex' }}>
                <div style={{ ...style, display: flex ? 'flex' : 'block', flex: 1, width: '100%' }}>
                    {children}
                </div>
            </Content>

            {footer && (
                <Footer style={{ textAlign: 'center', padding: 20 }}>
                    &copy; 2024 Sua Aplicação. Todos os direitos reservados.
                </Footer>
            )}
        </Container>
    );
}
