import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer, Loader } from 'rsuite';
import { useLocation } from 'react-router-dom';

import NavigationBar from '../../components/navigationBar';
import { getReportById, getUserById } from '../../utils/Api';
import { formatDate } from '../../utils/Parser';


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

                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 15 }}>

                        <section style={{ display: 'flex', alignItems: 'center', marginBottom: 25 }} >
                            <img src={User.pfp} style={{ width: 100, height: 100, borderRadius: "50%", marginRight: 25 }} alt='' />
                            <div>
                                <p className='dark-text m-0' >Reclamação aperta por : {User.nome}</p>
                                <p className='dark-text m-0' >Em : {formatDate(complaint.data, true)}</p>
                            </div>
                        </section>

                        <section style={{ display: 'flex', flexDirection: 'column' }} >
                            <h1 > {complaint.titulo} </h1>
                            <div style={{ display: 'flex', marginBottom: 25 }} >
                                <img style={{ maxHeight: 500 }} src={complaint.imagem} alt='' />
                                <p className='dark-text' style={{ marginLeft: 25 }}>
                                    {complaint.conteudo}
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </Content>
            <Footer></Footer>
        </Container>
    );
}
