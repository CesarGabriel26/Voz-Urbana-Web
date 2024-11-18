import React, { useEffect, useState } from 'react';
import { getUserById } from '../utils/Api';
import { Avatar, Pagination } from 'rsuite';


export default function SupportersList({ petition, theme }) {
    const [supporters, setSupporters] = useState([]);
    const [currentSuportersList, setCurrentSUportersList] = useState([])
    const [activePage, setActivePage] = useState(1);

    const [limit, setLimit] = React.useState(20);
    const [numberOfPages, setNumberOfPages] = useState(1);

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                const promises = petition.apoiadores.map(id => getUserById(id));
                const supportersData = await Promise.all(promises);

                var a = []

                for (let i = 0; i < 100; i++) {
                    a.push(supportersData)

                }

                setSupporters(a);
                console.log(a);
                

                changePage(1)

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
        minWidth: 200
    };

    const changePage = (page) => {
        setActivePage(page);

        const start = (page - 1) * limit;
        const end = start + limit;

        setCurrentSUportersList(supporters.slice(start, end));
    };

    return (
        <div style={{ marginTop: 15 }}>
            <p style={textStyle}><strong>Apoiadores:</strong></p>
            {supporters.length > 0 ? (
                <ul style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} >
                    {currentSuportersList.map((supporter, i) => (
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
                layout={['total', '|', 'pager', 'skip']}
                size="xs"
                prev={true}
                next={true}
                first={true}
                last={true}
                ellipsis={true}
                boundaryLinks={true}
                total={supporters.length}
                maxButtons={5}
                activePage={activePage}
                onChangePage={changePage}
                onChangeLimit={setLimit}
            />
        </div>
    );
};
