import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer, Loader } from 'rsuite';
import { useLocation } from 'react-router-dom';

import NavigationBar from '../../components/navigationBar';
import { getReportById, getUserById } from '../../utils/Api';


export default function DetalhesReclamacao() {
    const location = useLocation();

    const [complaint, setComplaint] = useState({});
    const [User, setUser] = useState({})

    const [loaded, setloaded] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const load = async () => {
        try {
            const id = location.state?.complaintId;
            if (id) {
                setloaded(false)
                
                let rest = await getReportById(id)
                console.log(rest);
                if (!rest.error) {
                    setComplaint(rest.content)
                }
                
                rest = await getUserById(rest.content.user_id)
                console.log(rest);
                if (!rest.error) {
                    setUser(rest.content)
                }
                setloaded(true)
            }
        } catch (error) {
            setloaded(false)
            console.log(error);
        }
    }
    const ControleScrollHeader = () => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }

    useEffect(() => {
        load(location.state?.complaintId)
    }, []);
    useEffect(() => {
        ControleScrollHeader()
    });

    return (
        <Container style={{
            height: '100vh',
            paddingTop: isSticky ? 80 : 0,
        }}>
            <Header
                style={{
                    position: isSticky ? 'fixed' : 'relative',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    transition: '3.s ease-in-out',
                }}
            >
                <NavigationBar />
            </Header>
            <Content style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <div className='gui-container' >
                    <h1 style={{ textAlign: 'center' }} > {complaint.titulo} </h1>
                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                        <section style={{ flex: 2, padding: 15, background: 'red' }} >
                            
                        </section>
                        <section style={{ flex: 1, padding: 15, background: 'blue' }} >



                        </section>
                    </div>
                </div>
            </Content>
            <Footer></Footer>
        </Container>
    );
}
