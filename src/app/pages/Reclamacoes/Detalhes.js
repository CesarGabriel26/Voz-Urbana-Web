import React, { useEffect, useState } from 'react';
import { Loader, Panel, FlexboxGrid, Avatar, Divider } from 'rsuite';
import { useLocation } from 'react-router-dom';
import { getReportById, getUserById } from '../../utils/Api';
import { formatDate } from '../../utils/Parser';
import BaseContainer from '../../components/BaseContainer';

export default function DetalhesReclamacao() {
    const location = useLocation();
    const [complaint, setComplaint] = useState({});
    const [user, setUser] = useState({});
    const [loaded, setLoaded] = useState(false);

    const load = async () => {
        try {
            const id = location.state?.complaintId;
            if (id) {
                setLoaded(false);

                let rest = await getReportById(id);
                if (!rest.error) {
                    setComplaint(rest.content);
                    rest = await getUserById(rest.content.user_id);
                    if (!rest.error) {
                        setUser(rest.content);
                    }
                }
                setLoaded(true);
            }
        } catch (error) {
            setLoaded(false);
            console.error(error);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <BaseContainer>
            {loaded ? (
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item colspan={16}>
                        <Panel bordered shaded style={{ padding: 20 }}>
                            <section style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                                <Avatar
                                    src={user.pfp}
                                    size="lg"
                                    circle
                                    alt='User Profile'
                                    style={{ marginRight: 20 }}
                                />
                                <div>
                                    <p className='dark-text m-0'>Reclamação aberta por: <strong>{user.nome}</strong></p>
                                    <p className='dark-text m-0'>Em: {formatDate(complaint.data, true)}</p>
                                </div>
                            </section>

                            <Divider />

                            <section style={{ marginBottom: 20 }}>
                                <h2>{complaint.titulo}</h2>
                                <FlexboxGrid justify="start" align="top">
                                    <FlexboxGrid.Item colspan={12}>
                                        <img
                                            src={complaint.imagem}
                                            alt='Complaint'
                                            style={{ maxWidth: '100%', borderRadius: 8 }}
                                        />
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item colspan={12} style={{ paddingLeft: 20 }}>
                                        <p className='dark-text'>{complaint.conteudo}</p>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </section>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            ) : (
                <Loader center content="Carregando detalhes..." />
            )}
        </BaseContainer>
    );
}
