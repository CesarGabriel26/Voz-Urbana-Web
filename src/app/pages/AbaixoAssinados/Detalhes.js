import React, { useState, useEffect } from 'react';
import {getPetitionById, getRemainingTimeForPetition } from '../../utils/Api';
import BaseContainer from '../../components/BaseContainer';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function VerPeticaoWeb({ petitionId }) {
    const [petition, setPetition] = useState(null);
    const [loading, setLoading] = useState(false);

    const statusSteps = ['Coleta', 'Aprovação', 'Conclusão'];

    const loadPetitionDetails = async () => {
        try {
            setLoading(true);
            const petitionDetails = await getPetitionById(petitionId);
            const remainingTime = await getRemainingTimeForPetition(petitionId);

            if (petitionDetails.content) {
                setPetition({ ...petitionDetails.content, ...remainingTime });
            } else {
                console.error('No content found in the response');
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
            {loading && <p>Loading...</p>}
            {petition ? (
                <div className="petition-container">
                    <div className="status-steps">
                        {statusSteps.map((step, index) => (
                            <div
                                key={index}
                                className={`step ${petition.status >= index ? 'active' : ''}`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    
                    <h1 className="title">{petition.causa || 'Título da Petição'}</h1>
                    <p className="description">{petition.content || 'Descrição da causa.'}</p>

                    <div className="date-container">
                        <span>Criada em: {new Date(petition.data).toLocaleDateString()}</span>
                        <span>Data limite: {new Date(petition.data_limite).toLocaleDateString()}</span>
                    </div>

                    <div className="progress-container">
                        <p>
                            {petition.signatures} de {petition.required_signatures} assinaturas
                        </p>
                        <ProgressBar
                            now={(petition.signatures / petition.required_signatures) * 100}
                            label={`${((petition.signatures / petition.required_signatures) * 100).toFixed(1)}%`}
                        />
                    </div>

                    <div className="time-container">
                        <span>Tempo restante: </span>
                        <span>
                            {petition.dias_restantes}d {petition.horas_restantes}h {petition.minutos_restantes}m
                        </span>
                    </div>

                    <button
                        className="sign-button"
                        onClick={() => alert('Assinatura realizada com sucesso!')}
                    >
                        Assinar Petição
                    </button>
                </div>
            ) : (
                <p>Não foi possível carregar os detalhes da petição.</p>
            )}
        </BaseContainer>
    );
}
