import React, { useEffect, useState, useRef } from 'react';
import { Loader, Input } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { getReportsByUser } from '../../utils/Api';
import ReportCard from '../../components/ReportCard';
import DecodeToken from '../../utils/JWT';
import BaseContainer from '../../components/BaseContainer';

export default function ReclamacoesDoUsuario() {
    const location = useLocation();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [position, setPosition] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    const mapRef = useRef();

    const loadData = async () => {
        try {
            setLoaded(false);
            const userToken = localStorage.getItem("usuario");
            const user = DecodeToken(userToken);
            const rest = await getReportsByUser(user.id);

            if (!rest.error) {
                setComplaints(rest.content);
                setFilteredComplaints(rest.content);
            } else {
                setError('Erro ao carregar reclamações. Tente novamente mais tarde.');
            }
            setLoaded(true);
        } catch (error) {
            setLoaded(false);
            setError('Erro ao carregar os dados.');
            console.error(error);
        }
    };

    const obterLocalizacao = () => {
        const complaintLocation = location.state?.local;

        if (complaintLocation) {
            setPosition(complaintLocation);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                },
                (error) => {
                    console.error("Erro na Geolocalização:", error);
                },
                { timeout: 10000 }
            );
        } else {
            console.error("Geolocalização não está disponível.");
            Alert.warning("Geolocalização não está disponível no seu navegador.");
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
        obterLocalizacao();
        loadData();
    }, []);

    useEffect(() => {
        if (mapRef.current && position) {
            mapRef.current.flyTo(position, 18);
        }
    }, [position]);

    return (
        <BaseContainer flex={true} footer={false}>
            <section style={{ flex: 1, padding: 15, display: 'flex', flexDirection: 'column'}}>
                <h3 className='text-primary-emphasis mb-3'>Suas Recentes</h3>
                <Input
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Pesquisar reclamações..."
                    style={{ marginBottom: 15 }}
                />
                {error && <Alert variant="danger">{error}</Alert>}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 25, overflowY: 'scroll' }}>
                    {
                        loaded ? (
                            filteredComplaints.length > 0 ? (
                                filteredComplaints.map((complaint, index) => (
                                    <ReportCard
                                        key={index}
                                        complaint={complaint}
                                        searchTerm={searchTerm}
                                        buttons={[{
                                            text: 'Ver no mapa',
                                            onclick: () => { setPosition([complaint.latitude, complaint.longitude]) }
                                        }]}
                                    />
                                ))
                            ) : <p className='text-dark-emphasis'>Nenhuma reclamação encontrada.</p>
                        ) : <Loader size="md" />
                    }
                </div>
            </section>

            <span class="border border-2 border-primary d-none d-md-block"></span>
           
            <section className='d-none d-md-block' style={{ flex: 1}} >
                {
                    position ? (
                        <MapContainer center={position} zoom={18} style={{ width: '100%', height: '100%' }} ref={mapRef}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {
                                loaded && filteredComplaints.map((complaint, index) => (
                                    <Marker key={index} position={[complaint.latitude, complaint.longitude]}>
                                        <Popup>
                                            {complaint.titulo}
                                        </Popup>
                                    </Marker>
                                ))
                            }
                        </MapContainer>
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                            <p className='dark-text'>
                                Algo deu errado, verifique a permissão de geolocalização, caso já tenha permitido, recarregue a página.
                            </p>
                        </div>
                    )
                }
            </section>
        </BaseContainer>
    );
}
