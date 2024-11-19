import React, { useEffect, useState } from 'react';
import { getUserById } from '../utils/Api';
import { Avatar, Pagination } from 'rsuite';

export default function SupportersList({ petition, theme }) {
    const [supporters, setSupporters] = useState([]);
    const [currentSupportersList, setCurrentSupportersList] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [limit, setLimit] = useState(20); // Itens por página

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                const promises = petition.apoiadores.map((id) => getUserById(id));
                const supportersData = await Promise.all(promises);

                // Populando a lista de apoiadores
                let a = [];
                for (let i = 0; i < 105; i++) {
                    a = [...a, ...supportersData];
                }

                setSupporters(a);
                changePage(1); // Define a página inicial
            } catch (error) {
                console.error('Erro ao buscar os apoiadores:', error);
            }
        };

        if (petition.apoiadores.length > 0) {
            fetchSupporters();
        }
    }, [petition.apoiadores]);

    // Função para trocar de página
    const changePage = (page) => {
        setActivePage(page);

        const start = (page - 1) * limit;
        const end = start + limit;

        setCurrentSupportersList(supporters.slice(start, end));
    };

    // Atualiza a página ao alterar o limite
    useEffect(() => {
        changePage(1); // Reinicia para a primeira página ao mudar o limite
    }, [limit, supporters]);

    // Estilo dinâmico baseado no tema
    const textStyle = {
        color: theme === 'dark' ? '#FFF' : '#000',
    };

    const listItemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '5px',
        minWidth: 200,
    };

    return (
        <div style={{ marginTop: 15 }}>
            <p style={textStyle}><strong>Apoiadores:</strong></p>
            {supporters.length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {currentSupportersList.map((supporter, i) => (
                        <li key={i} style={listItemStyle}>
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

            <Pagination
                layout={['pager', 'total', 'limit']}
                size="xs"
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                total={supporters.length}
                limit={limit}
                limitOptions={[10, 20, 50, 100]} // Opções de itens por página
                maxButtons={5}
                activePage={activePage}
                onChangePage={changePage}
                onChangeLimit={setLimit}
            />
        </div>
    );
}
