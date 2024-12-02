import React, { useEffect, useState } from 'react';
import { Loader, Panel, Row, Col, Avatar, Divider, Tag, Steps } from 'rsuite';
import { useLocation } from 'react-router-dom';
import { getReportById, getUserById } from '../../utils/Api';
import { formatDate } from '../../utils/Parser';
import BaseContainer from '../../components/BaseContainer';
import { loadCurrentUserData } from '../../controllers/userController';
import ActionButtonsComplaints from '../../components/ActionButtonsComplaints';
import { priorities } from '../../utils/consts';

export default function DetalhesReclamacao() {
    const location = useLocation();
    const prioridades = [...priorities]
    prioridades.shift()


    const [complaint, setComplaint] = useState({});
    const [user, setUser] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [theme, setTheme] = useState("light"); // Adicionado para monitorar o tema

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


    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') || "light";
        setTheme(currentTheme);

        const handleThemeChange = () => {
            setTheme(localStorage.getItem('theme') || "light");
        };

        window.addEventListener('storage', handleThemeChange);
        return () => window.removeEventListener('storage', handleThemeChange);
    }, []);

    const textColorClass = theme === "light" ? "text-dark" : "text-light";

    const randomPhoto = () => {
        const pfps = [
            "https://www.blookup.com/static/images/single/profile-1.edaddfbacb02.png",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-vfeVHe1s6k-TnUkqzEjzkWNKzcXjcUWKz3E1XxM7svVTYmzAstIhhZaw1EAwKzBoeaw&usqp=CAU",
        ]

        const random = Math.floor(Math.random() * pfps.length);

        return pfps[random]
    }

    return (
        <BaseContainer style={{ paddingTop: 10 }} footer={false}>
            <div style={{ maxWidth: '100%', padding: 10 }}>
                {loaded ? (
                    <Panel bordered shaded style={{ padding: 20 }}>
                        {/* User Information */}
                        <section style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <Avatar src={user.anonimo ? randomPhoto() : user.pfp} size="lg" circle alt='User Profile' style={{ marginRight: 20 }} />
                            <div>
                                <p className={`${textColorClass} m-0`}>Reclamação aberta por: <strong>{user.anonimo ? "XXXXXXXX" : user.nome}</strong></p>
                                <p className={`${textColorClass} m-0`}>Em: {formatDate(complaint.data, true)}</p>
                            </div>
                        </section>

                        <Divider />

                        {/* Complaint Details */}
                        <section style={{ marginBottom: 20 }}>
                            <h2 className={`d-none d-md-block ${textColorClass}`}>
                                {complaint.titulo || 'Título da Reclamação'}
                            </h2>
                            <h2 className={`d-block d-md-none ${textColorClass}`}>
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
                                    <p className={`${textColorClass} mt-2 mt-md-0`} style={{ textAlign: 'justify', overflowY: 'scroll', maxHeight: "500px" }}>{complaint.conteudo || 'Descrição do problema.'}</p>
                                </Col>
                            </Row>
                        </section>

                        <Divider />

                        {/* Complaint Status */}
                        <section>
                            <h3 className={textColorClass}>Status da Reclamação</h3>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                <Tag color={complaint.status === 1 ? 'green' : 'red'}>
                                    {complaint.status === 1 ? 'Aceito' : 'Pendente'}
                                </Tag>
                                <Tag style={{ marginLeft: 10, backgroundColor: prioridades[complaint.prioridade].color, color: prioridades[complaint.prioridade].textColor  }}>
                                    Prioridade: {complaint.prioridade}
                                </Tag>
                            </div>
                            <Steps
                                current={complaint.status === -1 ? 0 : complaint.status}
                                currentStatus={complaint.status === -1 ? 'error' : 'process'}
                                style={{ marginBottom: 20, marginTop: 20 }}
                                vertical={true}
                            >
                                <Steps.Item title={<p className={`${textColorClass}`}>Aguardando aprovação</p>} />
                                <Steps.Item title={<p className={`${textColorClass}`}>Sendo debatida / Analizada</p>} />
                                <Steps.Item title={<p className={`${textColorClass}`}>Resolvida</p>} />
                            </Steps>
                        </section>

                        <Divider />

                        {/* Additional Information */}
                        <section style={{ marginBottom: 20 }}>
                            <h4 className={textColorClass}>Informações Adicionais</h4>
                            <p className={`${textColorClass}`}><strong>Endereço:</strong> {complaint.adress || 'Não informado'}</p>
                            <p className={`${textColorClass}`}><strong>Categoria:</strong> {complaint.categoria || 'Não especificada'}</p>
                            <p className={`${textColorClass}`}><strong>Data de Conclusão:</strong> {complaint.data_conclusao ? formatDate(complaint.data_conclusao, true) : 'Em andamento'}</p>
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
