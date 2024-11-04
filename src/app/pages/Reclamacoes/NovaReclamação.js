import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import L from 'leaflet';

import { getLatLongFromAddress } from '../../utils/LatLong';
import BaseContainer from '../../components/BaseContainer';


L.Icon.Default.imagePath = 'leaflet/dist/images/';
// componente customizado de are de texto
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

export default function NovaReclamação() {
    const location = useLocation();

    const [image, setImage] = useState(null);
    const [position, setPosition] = useState(null);
    // const [loaded, setLoaded] = useState(false);
    const mapRef = useRef();

    const [formData, setFormData] = useState({
        titulo: '',
        problema: '',
        image: null,
        numero: '',
        rua: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: '',
    });

    useEffect(() => {
        if (mapRef.current && position) {
            mapRef.current.flyTo(position, 18);
        }
    }, [position]);

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
                handleChange('image', reader.result)
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


    const MapClickHandler = () => {
        useMapEvent({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        });
        return null;
    };

    const handleSubmit = async () => {
        try {
            // Cria um FormData para enviar a imagem junto com outros dados
            const formToSend = {
                'titulo': formData.titulo,
                'problema': formData.problema,
                'numero': formData.numero,
                'rua': formData.rua,
                'cidade': formData.cidade,
                'estado': formData.estado,
                'cep': formData.cep,
                'pais': formData.pais,
                'image': image
            }

            console.log(formToSend);

            let resp = await getLatLongFromAddress(formData.rua, formData.numero, formData.cidade, formData.estado, formData.pais)
            setPosition([resp.latitude, resp.longitude]);


        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const buscarEndereco = async () => {
        let resp = await getLatLongFromAddress(formData.rua, formData.numero, formData.cidade, formData.estado, formData.pais)
        setPosition([resp.latitude, resp.longitude]);
    }

    return (
        <BaseContainer
            footer={false}
            flex={true}
        >
            <Form
                onSubmit={handleSubmit}
                className='d-block d-md-flex'
                style={{ flex: 1, margin: 0 }}
            >
                <section
                    style={{ padding: 15, flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column', borderRightWidth: 2, borderRightStyle: 'solid' }}
                    className='border-primary'
                >
                    <h3 className='text-primary mb-3'>Crie uma nova reclamação</h3>

                    <div style={{ flex: 1, width: '100%' }}>
                        <Form.Group controlId="titulo" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary bold fs-5'>Título</Form.ControlLabel>
                            <Form.Control
                                name="titulo"
                                style={{ borderWidth: 4, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.titulo}
                                onChange={(value) => handleChange('titulo', value)}
                                required
                            />
                            <Form.HelpText>Uma descrição curta que indique seu problema</Form.HelpText>
                        </Form.Group>

                        <Form.Group controlId="problema" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className="text-primary bold fs-5">Informe o seu problema</Form.ControlLabel>
                            <Form.Control
                                className="border-primary fs-5"
                                rows={5}
                                name="problema"
                                accepter={Textarea}
                                value={formData.problema}
                                onChange={(value) => handleChange('problema', value)} // use o value diretamente
                                required
                                style={{ resize: 'none', borderWidth: 4, width: '100%' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="image" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary bold fs-5'>
                                Carregue uma imagem do Local e/ou problema
                            </Form.ControlLabel>

                            <div {...getRootProps()} style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                <input {...getInputProps()} />
                                {image ? (
                                    <img
                                        src={image}
                                        className='border-primary'
                                        alt="Imagem selecionada"
                                        style={{ width: "100%", height: 300, objectFit: 'cover', borderRadius: 10, borderWidth: 4 }}
                                    />
                                ) : (
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRNOkaLzIY09eCBjECGIoc8BFWmxw-mvTfDg&s"
                                        className='primary-border'
                                        alt="Clique para selecionar uma imagem"
                                        style={{ width: "100%", height: 300, objectFit: 'cover', borderRadius: 10, borderWidth: 4 }}
                                    />
                                )}
                            </div>

                            <Form.HelpText>Selecione uma imagem da galeria ou tire uma foto.</Form.HelpText>
                        </Form.Group>
                    </div>
                </section>

                <section
                    style={{ padding: 15, flexGrow: 1, flex: 1, display: 'flex', flexDirection: 'column', borderLeftWidth: 2, borderLeftStyle: 'solid' }}
                    className='border-primary'
                >
                    <h3 className='text-primary mb-3'>Informações do local</h3>

                    <div style={{ width: "100%", height: 300 }} >
                        {
                            position ? (
                                <MapContainer center={position} zoom={18} style={{ width: '100%', height: '100%' }} ref={mapRef}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <MapClickHandler />
                                    <Marker position={position}>
                                        <Popup>
                                            Sua localização
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                    <p className=''>
                                        Algo deu errado, verifique a permição de geolocalização, caso já tenha permitido recarregue a página.
                                    </p>
                                </div>
                            )
                        }
                    </div>

                    <div style={{ flex: 1, width: '100%' }}>
                        <div className='d-block d-md-flex'>
                            <Form.Group className='m-0 me-md-2' controlId="numero" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='text-primary bold fs-5'>Número</Form.ControlLabel>
                                <Form.Control
                                    name="numero"
                                    style={{ borderWidth: 4, flex: 1 }}
                                    className="border-primary dark-text fs-5"
                                    value={formData.numero}
                                    onChange={(value) => handleChange('numero', value)}
                                />
                                <Form.HelpText>O número da casa ou prédio (opicional)</Form.HelpText>
                            </Form.Group>
                            <Form.Group className='m-0 ms-md-2' controlId="rua" style={{ flex: 1 }}>
                                <Form.ControlLabel className='text-primary bold fs-5'>Rua</Form.ControlLabel>
                                <Form.Control
                                    name="rua"
                                    style={{ borderWidth: 4, flex: 1 }}
                                    className="border-primary dark-text fs-5"
                                    value={formData.rua}
                                    onChange={(value) => handleChange('rua', value)}
                                    required

                                />
                                <Form.HelpText>A rua onde o problema se encontra</Form.HelpText>
                            </Form.Group>
                        </div>

                        <div className='d-block d-md-flex'>
                            <Form.Group className='m-0 me-md-2' controlId="cidade" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='text-primary bold fs-5'>Cidade</Form.ControlLabel>
                                <Form.Control
                                    name="cidade"
                                    style={{ borderWidth: 4, flex: 1 }}
                                    className="border-primary dark-text fs-5"
                                    value={formData.cidade}
                                    onChange={(value) => handleChange('cidade', value)}
                                    required
                                />
                                <Form.HelpText>A cidade onde o problema se encontra</Form.HelpText>
                            </Form.Group>

                            <Form.Group className='m-0 ms-md-2' controlId="estado" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='text-primary bold fs-5'>Estado</Form.ControlLabel>
                                <Form.Control
                                    name="estado"
                                    style={{ borderWidth: 4, flex: 1 }}
                                    className="border-primary dark-text fs-5"
                                    value={formData.estado}
                                    onChange={(value) => handleChange('estado', value)}
                                    required
                                />
                                <Form.HelpText>O estado onde o problema se encontra</Form.HelpText>
                            </Form.Group>
                        </div>

                        <div className='d-block d-md-flex'>
                            <Form.Group className='m-0 me-md-2' controlId="cep" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='text-primary bold fs-5'>CEP</Form.ControlLabel>
                                <Form.Control
                                    name="cep"
                                    style={{ borderWidth: 4, flex: 1 }}
                                    className="border-primary dark-text fs-5"
                                    value={formData.cep}
                                    onChange={(value) => handleChange('cep', value)}
                                />
                                <Form.HelpText>O CEP da área (opicional)</Form.HelpText>
                            </Form.Group>

                            <Form.Group className='m-0 ms-md-2' controlId="pais" style={{ flex: 1, width: '100%' }}>
                                <Form.ControlLabel className='text-primary bold fs-5'>País</Form.ControlLabel>
                                <Form.Control
                                    name="pais"
                                    style={{ borderWidth: 4, flex: 1 }}
                                    className="border-primary dark-text fs-5"
                                    value={formData.pais}
                                    onChange={(value) => handleChange('pais', value)}
                                    required
                                />
                                <Form.HelpText>O país onde o problema se encontra</Form.HelpText>
                            </Form.Group>
                        </div>

                        <div className='d-block d-md-flex'>
                            <Form.Group style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly' }} >
                                <Button
                                    className='mt-3 btn btn-primary'
                                    type='submit'
                                >Enviar Reclamação</Button>
                                <Button
                                    className='mt-3 btn btn-primary'
                                    onClick={buscarEndereco}
                                >Buscar Endereço</Button>
                            </Form.Group>
                        </div>
                    </div>
                </section>
            </Form>
        </BaseContainer>
    );
}
