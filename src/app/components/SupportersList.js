import React, { useEffect, useState } from 'react';
import { getUserById } from '../utils/Api';
import { Avatar } from 'rsuite';

export default function SupportersList({ petition, theme }) {
    const [supporters, setSupporters] = useState([]);

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                const promises = petition.apoiadores.map(id => getUserById(id));
                const supportersData = await Promise.all(promises);
                setSupporters(supportersData);
            } catch (error) {
                console.error('Erro ao buscar os apoiadores:', error);
            }
        };

        if (petition.apoiadores.length > 0) {
            fetchSupporters();
        }
    }, [petition.apoiadores]);

    // Define estilos condicionais baseados no tema
    const textStyle = {
        color: theme === 'dark' ? '#FFF' : '#000',
    };

    const listItemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '5px',
    };

    return (
        <div style={{marginTop: 15}}>
            <p style={textStyle}><strong>Apoiadores:</strong></p>
            {supporters.length > 0 ? (
                <ul>
                    {supporters.map(supporter => (
                        <li key={supporter.content.id} style={listItemStyle}>
                            <Avatar
                                src={supporter.content.pfp}
                                alt={`${supporter.content.nome}'s profile`}
                                size="lg"
                                circle
                                style={{ marginRight: 10 }}
                            />
                            <span style={textStyle}>
                                {supporter.content.nome} ({supporter.content.email})
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={textStyle}>Ninguém apoiou ainda</p>
            )}
        </div>
    );
};
