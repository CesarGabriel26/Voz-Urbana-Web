import React, { useState, useEffect } from 'react';
import { getPetitionById, getRemainingTimeForPetition, getUserById } from '../../utils/Api';
import BaseContainer from '../../components/BaseContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Loader, Steps, Panel, FlexboxGrid, Avatar, Divider } from 'rsuite';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../../utils/Parser';
import { loadCurrentUserData } from '../../controllers/userController';
import ActionButtons from '../../components/ActionButtons';
import SupportersList from '../../components/SupportersList ';

export default function VerPeticaoWeb() {
    const location = useLocation();

    const [petition, setPetition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    const loadPetitionDetails = async () => {
        try {
            const id = location.state?.petitionId;
            if (id) {
                setLoading(true);

                const petitionDetails = await getPetitionById(id);
                const remainingTime = await getRemainingTimeForPetition(id);
                console.log(petitionDetails);

                if (petitionDetails.content) {
                    setPetition({ ...petitionDetails.content, ...remainingTime });

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

    return (
        <BaseContainer>
            <div style={{ maxWidth: '100%', padding: 10 }}>
                {loading && <Loader center content="Carregando detalhes..." />}
                {petition && !loading ? (
                    <Panel bordered shaded style={{ flex: 1}} >
                        {/* User Information Section */}
                        <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
                            <FlexboxGrid.Item>
                                <Avatar src={user.pfp} size="lg" circle alt='User Profile' />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item style={{ maxWidth: '80%' }}>
                                <p className='dark-text m-0'>Petição criada por: <strong>{user.nome}</strong></p>
                                <p className='dark-text m-0'>Em: {formatDate(petition.data, true)}</p>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        <Divider />

                        {/* Petition Details */}
                        <section style={{ marginBottom: 20 }}>
                            <h2>{petition.titulo || 'Título da Petição'}</h2>
                            <p className='dark-text' style={{ textAlign: 'justify' }}>{petition.content || 'Descrição da causa.'}</p>
                        </section>
                        <Divider />

                        {/* Petition Status */}
                        <section>
                            <h3>Status da Petição</h3>
                            <Steps
                                current={petition.status === -1 ? 0 : petition.status}
                                currentStatus={petition.status === -1 ? 'error' : 'process'}
                                style={{ marginBottom: 20, marginTop: 20 }}
                                vertical={true}
                            >
                                <Steps.Item title="Aguardando aprovação" />
                                <Steps.Item title="Coleta de assinaturas" />
                                <Steps.Item title="Encerrada" />
                            </Steps>
                            <p>{petition.signatures} de {petition.required_signatures} assinaturas</p>
                            <ProgressBar
                                style={{ marginBottom: 20, marginTop: 20 }}
                                now={(petition.signatures / petition.required_signatures) * 100}
                                label={`${((petition.signatures / petition.required_signatures) * 100).toFixed(2)}%`}
                            />
                            <p><strong>Tempo Restante:</strong> {petition.tempo_restante.dias_restantes} dias, {petition.tempo_restante.horas_restantes} horas, {petition.tempo_restante.minutos_restantes} minutos</p>
                        </section>

                        {/* Additional Information */}
                        <Divider />
                        <section style={{ marginBottom: 20 }}>
                            <h4>Informações Adicionais</h4>
                            <p><strong>Data Limite:</strong> {petition.data_limite ? formatDate(petition.data_limite, true) : 'Não especificada'}</p>
                            <p><strong>Atualizado em:</strong> {petition.data_ultima_atualizacao ? formatDate(petition.data_ultima_atualizacao, true) : 'Data não encontrada'}</p>
                            <p><strong>Data de Conclusão:</strong> {petition.data_conclusao ? formatDate(petition.data_conclusao, true) : 'Em andamento'}</p>
                            <p><strong>Categoria:</strong> {petition.categoria || 'Não especificada'}</p>
                            <p><strong>Local:</strong> {petition.local || 'Não informado'}</p>
                            {petition.motivo_encerramento && (
                                <p><strong>Motivo de Encerramento:</strong> {petition.motivo_encerramento}</p>
                            )}
                            <SupportersList petition={petition} />
                        </section>

                        {/* Action Buttons */}
                        <ActionButtons petition={petition} reloadFunction={loadPetitionDetails} currentUser={currentUser} />
                    </Panel>
                ) : (
                    !loading && !petition? <p>Não foi possível carregar os detalhes da petição.</p> : null
                )}
            </div>
        </BaseContainer>
    );
}
