import React, { useState, useEffect } from 'react';
import { getPetitionById, getRemainingTimeForPetition, getUserById } from '../../utils/Api';
import BaseContainer from '../../components/BaseContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Loader, Steps, Panel, FlexboxGrid, Avatar, Divider, Tag } from 'rsuite';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../../utils/Parser';
import { loadCurrentUserData } from '../../controllers/userController';
import ActionButtons from '../../components/ActionButtons';
import SupportersList from '../../components/SupportersList';
import { priorities } from '../../utils/consts';

export default function VerPeticaoWeb() {
    const location = useLocation();
    const prioridades = [...priorities]
    prioridades.shift()


    const [petition, setPetition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [theme, setTheme] = useState("light"); // Adicionado para monitorar o tema
    const [priori, setPriori] = useState(0);

    const loadPetitionDetails = async () => {
        try {
            const id = location.state?.petitionId;
            if (id) {
                setLoading(true);

                const petitionDetails = await getPetitionById(id);
                const remainingTime = await getRemainingTimeForPetition(id);

                if (petitionDetails.content) {
                    setPetition({ ...petitionDetails.content, ...remainingTime });
                    setPriori(petitionDetails.content.prioridade)

                    const userData = await getUserById(petitionDetails.content.user_id);
                    setUser(userData.content);
                } else {
                    console.error('No content found in the response');
                }
            }

            const [user, ok] = loadCurrentUserData();
            if (ok) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error loading petition details:', error);
        }
    };

    useEffect(() => {
        loadPetitionDetails();
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
    const backgroundColorClass = theme === "light" ? "bg-light" : "bg-dark";

    const randomPhoto = () => {
        const pfps = [
            "https://www.blookup.com/static/images/single/profile-1.edaddfbacb02.png",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-vfeVHe1s6k-TnUkqzEjzkWNKzcXjcUWKz3E1XxM7svVTYmzAstIhhZaw1EAwKzBoeaw&usqp=CAU",
        ]

        const random = Math.floor(Math.random() * pfps.length);

        return pfps[random]
    }

    return (
        <BaseContainer>
            <div style={{ maxWidth: '100%', padding: 10 }}>
                {loading && <Loader center content="Carregando detalhes..." />}
                {petition && !loading ? (
                    <Panel className={backgroundColorClass} bordered shaded style={{ flex: 1 }}>
                        {/* User Information Section */}
                        <FlexboxGrid align="middle" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 15 }}>
                            <FlexboxGrid.Item>
                                <Avatar src={user.anonimo ? randomPhoto() : user.pfp} size="lg" circle alt='User Profile' />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item style={{ maxWidth: '80%' }}>
                                <p className={`${textColorClass} m-0`}>Petição criada por: <strong>{user.anonimo ? "XXXXXXXX" : user.nome}</strong></p>
                                <p className={`${textColorClass} m-0`}>Em: {formatDate(petition.data, true)}</p>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        <Divider />

                        {/* Petition Details */}
                        <section style={{ marginBottom: 20 }}>
                            <h2 className={`${textColorClass}`}>{petition.titulo || 'Título da Petição'}</h2>
                            <p className={`${textColorClass}`} style={{ textAlign: 'justify' }}>{petition.content || 'Descrição da causa.'}</p>
                        </section>
                        <Divider />

                        {/* Petition Status */}
                        <section>
                            <h3 className={`${textColorClass}`}>Status da Petição</h3>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                                <Tag color={petition.status === 1 ? 'green' : 'red'}>
                                    {petition.status === 1 ? 'Aceito' : petition.status === -1 ? 'Reprovado' : 'Pendente'}
                                </Tag>
                                <Tag style={{ marginLeft: 10, backgroundColor: prioridades[petition.prioridade].color, color: prioridades[petition.prioridade].textColor }}>
                                    Prioridade: {petition.prioridade}
                                </Tag>
                            </div>
                            <Steps
                                current={petition.status === -1 ? 0 : petition.status}
                                currentStatus={petition.status === -1 ? 'error' : 'process'}
                                style={{ marginBottom: 20, marginTop: 20 }}
                                vertical={true}
                            >
                                <Steps.Item title={<p className={`${textColorClass}`}>Aguardando aprovação</p>} />
                                <Steps.Item title={<p className={`${textColorClass}`}>Coleta de assinaturas</p>} />
                                <Steps.Item title={<p className={`${textColorClass}`}>Encerrada</p>} />
                            </Steps>
                            <p className={`${textColorClass}`}>{petition.signatures} de {petition.required_signatures} assinaturas</p>
                            <ProgressBar
                                style={{ marginBottom: 20, marginTop: 20 }}
                                now={(petition.signatures / petition.required_signatures) * 100}
                                label={`${((petition.signatures / petition.required_signatures) * 100).toFixed(2)}%`}
                            />
                            <p className={`${textColorClass}`}><strong>Tempo Restante:</strong> {petition.tempo_restante.dias_restantes} dias, {petition.tempo_restante.horas_restantes} horas, {petition.tempo_restante.minutos_restantes} minutos</p>
                        </section>

                        {/* Additional Information */}
                        <Divider />
                        <section style={{ marginBottom: 20 }}>
                            <h4 className={`${textColorClass}`}>Informações Adicionais</h4>
                            <p className={`${textColorClass}`}><strong>Data Limite:</strong> {petition.data_limite ? formatDate(petition.data_limite, true) : 'Não especificada'}</p>
                            <p className={`${textColorClass}`}><strong>Atualizado em:</strong> {petition.data_ultima_atualizacao ? formatDate(petition.data_ultima_atualizacao, true) : 'Data não encontrada'}</p>
                            <p className={`${textColorClass}`}><strong>Data de Conclusão:</strong> {petition.data_conclusao ? formatDate(petition.data_conclusao, true) : 'Em andamento'}</p>
                            <p className={`${textColorClass}`}><strong>Categoria:</strong> {petition.categoria || 'Não especificada'}</p>
                            <p className={`${textColorClass}`}><strong>Local:</strong> {petition.local || 'Não informado'}</p>
                            {petition.motivo_encerramento && (
                                <p><strong>Motivo de Encerramento:</strong> {petition.motivo_encerramento}</p>
                            )}
                            <SupportersList petition={petition} theme={theme} />
                        </section>

                        {/* Action Buttons */}
                        <ActionButtons petition={petition} reloadFunction={loadPetitionDetails} currentUser={currentUser} 
                            prioridade={priori}
                            setPrioridade={setPriori}
                        />
                    </Panel>
                ) : (
                    !loading && !petition ? <p>Não foi possível carregar os detalhes da petição.</p> : null
                )}
            </div>
        </BaseContainer>
    );
}
