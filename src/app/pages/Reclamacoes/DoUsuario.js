import React, { useEffect, useState, useRef } from 'react';
import { Container, Header, Content, Footer, Loader, Input } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

import { getReportsByUser } from '../../utils/Api';
import NavigationBar from '../../components/navigationBar';

import L from 'leaflet';
import GeoIcon from '../../assets/GeoIcon.svg';
import ReportCard from '../../components/ReportCard';
import DecodeToken from '../../utils/JWT';

const geoIcon = L.icon({
    iconUrl: GeoIcon,
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

export default function ReclamacoesDoUsuario() {
    const location = useLocation();

    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [position, setPosition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);

    const mapRef = useRef();

    const loadList = async () => {
        try {
            setLoaded(false);
            // PELO AMOR DE DEUS: USAR PARA PEGAR AS INFORMAÇÕES DO USUÁRIO
            let userToken = localStorage.getItem("usuario")
            let user = DecodeToken(userToken)
            let rest = await getReportsByUser(user.id);

            if (!rest.error) {
                setComplaints(rest.content);
                setFilteredComplaints(rest.content);
            }
            setLoaded(true);
        } catch (error) {
            setLoaded(false);
            console.log(error);
        }
    };

    const ObterLocalizacao = () => {
        let complaintLocation = location.state?.local;

        if (complaintLocation) {
            setPosition(complaintLocation);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setPosition([latitude, longitude]);
                    },
                    (error) => {
                        console.error("Erro na Geolocalização:", error);
                    },
                    {
                        // Configurações opcionais, como timeout
                        timeout: 10000, // 10 segundos para falhar se não conseguir obter a localização
                    }
                );
            } else {
                console.error("Geolocalização não está disponível.");
                alert("Geolocalização não está disponível no seu navegador.");
            }
        }
    };

    const handleSearch = (value) => {
        const term = value?.toLowerCase() || '';
        setSearchTerm(value);

        const filtered = complaints.filter((complaint) => {
            const titulo = complaint.titulo?.toLowerCase() || '';
            const conteudo = complaint.conteudo?.toLowerCase() || '';
            return titulo.includes(term) || conteudo.includes(term);
        });

        setFilteredComplaints(filtered);
    };

    useEffect(() => {
        ObterLocalizacao();
        loadList();
    }, []);

    useEffect(() => {
        if (mapRef.current && position) {
            mapRef.current.flyTo(position, 13);
        }
    }, [position]);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        });
        return null;
    };

    return (
        <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ top: 0, width: '100%', zIndex: 1000 }}>
                <NavigationBar />
            </Header>
            <Content style={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 79px)' }}>
                <section style={{ flex: 1, padding: 15, display: 'flex', flexDirection: 'column', borderRightWidth: .5, borderRightColor: 'black', borderRightStyle: 'solid' }}>
                    <h3 className='primary-text mb-3'>Suas Recentes</h3>

                    {/* Barra de pesquisa */}
                    <Input
                        value={searchTerm}
                        onChange={(v) => handleSearch(v)}
                        placeholder="Pesquisar reclamações..."
                        style={{ marginBottom: 15 }}
                    />

                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 25, overflowY: 'scroll' }}>
                        {
                            loaded ? (
                                filteredComplaints.length > 0 ? (
                                    filteredComplaints.map((complaint, index) => (
                                        <ReportCard
                                            key={index}
                                            complaint={complaint}
                                            searchTerm={searchTerm}
                                            buttons={[
                                                {
                                                    text: 'Ver no mapa',
                                                    onclick: () => { setPosition([complaint.latitude, complaint.longitude]) }
                                                },
                                            ]}
                                        />
                                    ))
                                ) : <p>Nenhuma reclamação encontrada.</p>
                            ) : <Loader size="md" />
                        }
                    </div>
                </section>

                <section style={{ flex: 1, borderLeftWidth: .5, borderLeftColor: 'black', borderLeftStyle: 'solid' }}>
                    {
                        position ? (
                            <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }} ref={mapRef} >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MapClickHandler />
                                <Marker position={position} icon={geoIcon}>
                                    <Popup>
                                        Sua localização
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <p className='dark-text'>
                                    Algo deu errado, verifique a permição de geolocalização, caso já tenha permitido recarregue a página.
                                </p>
                            </div>
                        )
                    }
                </section>
            </Content>
            <Footer></Footer>
        </Container>
    );
}