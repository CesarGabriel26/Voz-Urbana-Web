import React, { useEffect, useState, useRef } from 'react';
import { Container, Header, Content, Footer, Form, Input } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import L from 'leaflet';

import { getReportsByUser } from '../../utils/Api';
import NavigationBar from '../../components/navigationBar';

import GeoIcon from '../../assets/GeoIcon.svg';
import ReportCard from '../../components/ReportCard';
import DecodeToken from '../../utils/JWT';

const geoIcon = L.icon({
    iconUrl: GeoIcon,
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});


export default function NovaReclamação() {
    const location = useLocation();

    const [image, setImage] = useState(null);
    const [position, setPosition] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const mapRef = useRef();

    // componente customizado de are de texto
    const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

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
                        timeout: 10000,
                    }
                );
            } else {
                console.error("Geolocalização não está disponível.");
                alert("Geolocalização não está disponível no seu navegador.");
            }
        }
    };

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop,
    });

    useEffect(() => {
        ObterLocalizacao();
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
            <Content style={{ display: 'flex', flexGrow: 1 }}>
                <section style={{ padding: 25, flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 className='primary-text mb-3'>Crie uma nova reclamação</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Form style={{ flex: 1, width: '100%' }}>
                            <Form.Group controlId="titulo" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='primary-text bold fs-5'>Título</Form.ControlLabel>
                                <Form.Control
                                    name="titulo"
                                    style={{ borderWidth: 4, width: '100%' }}
                                    className="primary-border dark-text fs-5"
                                />
                                <Form.HelpText>Uma descrição curta que indique seu problema</Form.HelpText>
                            </Form.Group>

                            <Form.Group controlId="Problema" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className="primary-text bold fs-5">Informe o seu problema</Form.ControlLabel>
                                <Form.Control
                                    className="primary-border dark-text fs-5"
                                    rows={5}
                                    name="Problema"
                                    accepter={Textarea}
                                    style={{ resize: 'none', borderWidth: 4, width: '100%' }}
                                />
                                <Form.HelpText>Uma descrição completa sobre o problema</Form.HelpText>
                            </Form.Group>

                            <Form.Group controlId="image" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='primary-text bold fs-5'>
                                    Carregue uma imagem do Local e/ou problema
                                </Form.ControlLabel>

                                <div {...getRootProps()} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                    <input {...getInputProps()} />
                                    {image ? (
                                        <img
                                            src={image}
                                            className='primary-border'
                                            alt="Imagem selecionada"
                                            style={{ width: "100%", height: 300, objectFit: 'cover', borderRadius: 10, borderWidth: 4 }}
                                        />
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/200"
                                            className='primary-border'
                                            alt="Clique para selecionar uma imagem"
                                            style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 10, borderWidth: 4 }}
                                        />
                                    )}
                                </div>

                                <Form.HelpText>Selecione uma imagem da galeria ou tire uma foto.</Form.HelpText>
                            </Form.Group>
                        </Form>
                    </div>
                </section>

                <section
                    className='d-none d-md-flex'
                    style={{ padding: 15, flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'green' }}
                >
                    <h3 className='primary-text mb-3'>Informações do local</h3>

                    <Form>
                        <Form.Group controlId="textarea">
                            <Form.ControlLabel>Textarea</Form.ControlLabel>
                            <Form.Control
                                className='primary-border'
                                rows={10}
                                name="textarea"
                                accepter={Textarea}
                                style={{ resize: 'none', borderWidth: 4 }}
                            />
                        </Form.Group>
                    </Form>
                </section>
            </Content>
            <Footer></Footer>
        </Container>
    );
}
