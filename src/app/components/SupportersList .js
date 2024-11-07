import React, { useEffect, useState } from 'react';
import { getUserById } from '../utils/Api';
import { Avatar } from 'rsuite';

export default function SupportersList({ petition }) {
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

    return (
        <div>
            <p><strong>Apoiadores:</strong></p>
            {supporters.length > 0 ? (
                <ul>
                    {supporters.map(supporter => (
                        <li key={supporter.content.id} style={{ display: 'flex', alignItems: 'center' }} >
                            <Avatar
                                src={supporter.content.pfp}
                                alt={`${supporter.content.nome}'s profile`}
                                size="lg"
                                circle
                                style={{ marginRight: 10 }}
                            />
                            {supporter.content.nome} ({supporter.content.email})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Ninguém apoiou ainda</p>
            )}
        </div>
    );
};
