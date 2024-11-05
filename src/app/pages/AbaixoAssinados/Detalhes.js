import React, { useState, useEffect } from 'react';
import { getPetitionById, getRemainingTimeForPetition, getUserById } from '../../utils/Api';
import BaseContainer from '../../components/BaseContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Steps, Panel, FlexboxGrid, Avatar, Divider } from 'rsuite';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../../utils/Parser';

export default function VerPeticaoWeb() {
    const location = useLocation();

    const [petition, setPetition] = useState(null);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const loadPetitionDetails = async () => {
        try {
            const id = location.state?.petitionId;
            if (id) {
                setLoading(true);

                const petitionDetails = await getPetitionById(id);
                const remainingTime = await getRemainingTimeForPetition(id);

                if (petitionDetails.content) {
                    setPetition({ ...petitionDetails.content, ...remainingTime });
                    
                    const userData = await getUserById(petitionDetails.content.user_id);
                    setUser(userData.content);

                } else {
                    console.error('No content found in the response');
                }
                setLoading(false);
            }
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
            {loading && <p>Loading...</p>}
            {petition ? (
                <Panel bordered shaded style={{ padding: 20, flex: 1 }}>
                    {/* User Information Section */}
                    <section style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                        <Avatar src={user.pfp} size="lg" circle alt='User Profile' style={{ marginRight: 20 }} />
                        <div>
                            <p className='dark-text m-0'>Petição criada por: <strong>{user.nome}</strong></p>
                            <p className='dark-text m-0'>Em: {formatDate(petition.data, true)}</p>
                        </div>
                    </section>
                    <Divider />
                    
                    {/* Petition Details */}
                    <section style={{ marginBottom: 20 }}>
                        <h2>{petition.titulo || 'Título da Petição'}</h2>
                        <p><strong>Categoria:</strong> {petition.categoria || 'Não especificada'}</p>
                        <p><strong>Local:</strong> {petition.local || 'Não informado'}</p>
                        <FlexboxGrid justify="start" align="top">
                            <FlexboxGrid.Item style={{ paddingLeft: 20, minHeight: 150, flex: 1 }}>
                                <p className='dark-text' style={{ textAlign: 'justify' }}>{petition.content || 'Descrição da causa.'}</p>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </section>
                    <Divider />
                    
                    {/* Petition Status */}
                    <section>
                        <h3>Status da Petição</h3>
                        <Steps current={petition.status === -1 ? 0 : petition.status} currentStatus={petition.status === -1 ? 'error' : 'process'} style={{ marginBottom: 20, marginTop: 20 }}>
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
                        <p><strong>Data Limite:</strong> {petition.data_limite ? formatDate(petition.data_limite) : 'Não especificada'}</p>
                        <p><strong>Data de Conclusão:</strong> {petition.data_conclusao ? formatDate(petition.data_conclusao) : 'Em andamento'}</p>
                        <p><strong>Total de Apoios:</strong> {petition.total_apoios}</p>
                        {petition.motivo_encerramento && (
                            <p><strong>Motivo de Encerramento:</strong> {petition.motivo_encerramento}</p>
                        )}
                    </section>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className='btn btn-danger'>Reprovar</button>
                        <button className='btn btn-success'>Aprovar</button>
                        <button className='btn btn-secondary'>Encerrar</button>
                    </div>
                </Panel>
            ) : (
                <p>Não foi possível carregar os detalhes da petição.</p>
            )}
        </BaseContainer>
    );
}
