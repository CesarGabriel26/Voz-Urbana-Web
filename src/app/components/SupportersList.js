import React, { useEffect, useState } from 'react';
import { getUserById } from '../utils/Api';
import { Avatar, Pagination } from 'rsuite';

export default function SupportersList({ petition, theme }) {
    const [supporters, setSupporters] = useState([]);
    const [currentSupportersList, setCurrentSupportersList] = useState([]);
    const [activePage, setActivePage] = useState(1);

    const [limit, setLimit] = useState(20);
    const [numberOfPages, setNumberOfPages] = useState(1);

    // Responsividade: Ajusta o limite com base no tamanho da tela
    useEffect(() => {
        const handleResize = () => {
            const newLimit = window.innerWidth < 768 ? 2 : 44;
            setLimit(newLimit);
        };

        // Adiciona o listener de redimensionamento
        window.addEventListener('resize', handleResize);

        // Define o limite inicial
        handleResize();

        // Remove o listener quando o componente desmonta
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                const promises = petition.apoiadores.map(id => getUserById(id));
                const supportersData = await Promise.all(promises);

                // Após debug, remover preenchimento artificial
                // var a = [];

                // for (let i = 0; i < 50; i++) {
                //     a = [...a, ...supportersData];
                // }

                setSupporters(supportersData);

                // Atualizar página inicial
                setActivePage(1);
                changePage(1, supportersData, limit);
            } catch (error) {
                console.error('Erro ao buscar os apoiadores:', error);
            }
        };

        if (petition.apoiadores.length > 0) {
            fetchSupporters();
        }
    }, [petition.apoiadores]);

    useEffect(() => {
        setNumberOfPages(Math.ceil(supporters.length / limit));
        changePage(activePage, supporters, limit);
    }, [supporters, limit]);

    const textStyle = {
        color: theme === 'dark' ? '#FFF' : '#000',
    };

    const listItemStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: theme === 'dark' ? '#333' : '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '10px',
        minWidth: '200px',
        textAlign: 'center',
    };

    const changePage = (page, data = supporters, itemsPerPage = limit) => {
        setActivePage(page);

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        setCurrentSupportersList(data.slice(start, end));
    };

    return (
        <div style={{ marginTop: 15 }}>
            <p style={textStyle}><strong>Apoiadores:</strong></p>
            {supporters.length > 0 ? (
                <ul
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px',
                        padding: '0',
                        listStyleType: 'none',
                        minHeight: limit > 2? 610 : 0
                    }}
                >
                    {currentSupportersList.map((supporter, i) => (
                        <li key={i} style={listItemStyle}>
                            <Avatar
                                src={supporter.content.pfp}
                                alt={`${supporter.content.nome}'s profile`}
                                size="lg"
                                circle
                                style={{ marginBottom: 10 }}
                            />
                            <span style={textStyle}>
                                <strong>{supporter.content.nome}</strong> <br />
                                {supporter.content.email}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={textStyle}>Ninguém apoiou ainda</p>
            )}

            <Pagination
                layout={limit > 2 ? ['total', '|', 'pager', 'skip'] : ['pager']}
                size="xs"
                prev
                next
                first={limit > 2}
                last={limit > 2}
                ellipsis
                boundaryLinks={limit > 2}
                total={supporters.length}
                limit={limit}
                maxButtons={5}
                activePage={activePage}
                onChangePage={(page) => changePage(page)}
                onChangeLimit={(newLimit) => setLimit(newLimit)}
            />
        </div>
    );
}
