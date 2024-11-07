import React, { useEffect, useState } from 'react';
import { Loader, Panel, Row, Col, Avatar, Divider, Tag, Steps } from 'rsuite';
import { useLocation } from 'react-router-dom';
import { getReportById, getUserById } from '../../utils/Api';
import { formatDate } from '../../utils/Parser';
import BaseContainer from '../../components/BaseContainer';
import { loadCurrentUserData } from '../../controllers/userController';
import ActionButtonsComplaints from '../../components/ActionButtonsComplaints';

export default function DetalhesReclamacao() {
    const location = useLocation();

    const [complaint, setComplaint] = useState({});
    const [user, setUser] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

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
            }

            const [user, ok] = loadCurrentUserData();
            if (ok) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            setLoaded(true);
        } catch (error) {
            setLoaded(false);
            console.error(error);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <BaseContainer style={{ paddingTop: 10 }} footer={false}>
            <div style={{ maxWidth: '100%', padding: 10 }}>
                {loaded ? (
                    <Panel bordered shaded style={{ padding: 20 }}>
                        {/* User Information */}
                        <section style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <Avatar src={user.pfp} size="lg" circle alt='User Profile' style={{ marginRight: 20 }} />
                            <div>
                                <p className='dark-text m-0'>Reclamação aberta por: <strong>{user.nome}</strong></p>
                                <p className='dark-text m-0'>Em: {formatDate(complaint.data, true)}</p>
                            </div>
                        </section>

                        <Divider />

                        {/* Complaint Details */}
                        <section style={{ marginBottom: 20 }}>
                            <h2 className='d-none d-md-block'>
                                {complaint.titulo || 'Título da Reclamação'}
                            </h2>
                            <h2 className='d-block d-md-none' >
                                <marquee direction="left">{complaint.titulo || 'Título da Reclamação'}</marquee>
                            </h2>
                            <Row>
                                <Col xs={24} md={12}>
                                    <img
                                        src={complaint.imagem}
                                        alt='Complaint'
                                        className="img-fluid rounded"
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col xs={24} md={12} style={{ paddingLeft: 20 }}>
                                    <p className='dark-text' style={{ textAlign: 'justify' }}>{complaint.conteudo || 'Descrição do problema.'}</p>
                                </Col>
                            </Row>
                        </section>

                        <Divider />

                        {/* Complaint Status */}
                        <section>
                            <h3>Status da Reclamação</h3>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                <Tag color={complaint.status === 1 ? 'green' : 'red'}>
                                    {complaint.status === 1 ? 'Aceito' : 'Pendente'}
                                </Tag>
                                <Tag color={complaint.prioridade === 1 ? 'orange' : 'blue'} style={{ marginLeft: 10 }}>
                                    Prioridade: {complaint.prioridade === 1 ? 'Alta' : 'Normal'}
                                </Tag>
                            </div>
                            <Steps
                                current={complaint.status === -1 ? 0 : complaint.status}
                                currentStatus={complaint.status === -1 ? 'error' : 'process'}
                                style={{ marginBottom: 20, marginTop: 20 }}
                                vertical={true}
                            >
                                <Steps.Item title="Aguardando aprovação" />
                                <Steps.Item title="Sendo debatida / Analizada" />
                                <Steps.Item title="Resolvida" />
                            </Steps>
                        </section>

                        <Divider />

                        {/* Additional Information */}
                        <section style={{ marginBottom: 20 }}>
                            <h4>Informações Adicionais</h4>
                            <p><strong>Endereço:</strong> {complaint.adress || 'Não informado'}</p>
                            <p><strong>Categoria:</strong> {complaint.categoria || 'Não especificada'}</p>
                            <p><strong>Data de Conclusão:</strong> {complaint.aceito ? formatDate(complaint.data_conclusao, true) : 'Em andamento'}</p>
                        </section>

                        {/* Action Buttons */}
                        <ActionButtonsComplaints complaint={complaint} reloadFunction={load} currentUser={currentUser} />
                    </Panel>
                ) : (
                    <Loader center content="Carregando detalhes..." />
                )}
            </div>
        </BaseContainer>
    );
}
