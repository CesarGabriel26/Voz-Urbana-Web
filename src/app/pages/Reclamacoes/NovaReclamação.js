import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Form, Input, Button, ButtonToolbar } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import L from 'leaflet';
import { getLatLongFromAddress } from '../../utils/LatLong';
import BaseContainer from '../../components/BaseContainer';
import DecodeToken from '../../utils/JWT';
import { createReport, uploadImage } from '../../utils/Api';

L.Icon.Default.imagePath = 'leaflet/dist/images/';

// Componente customizado de área de texto
const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

export default function NovaReclamação() {
    const location = useLocation();
    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [position, setPosition] = useState(null);
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
        pais: 'Brasil',
    });

    useEffect(() => {
        if (mapRef.current && position) {
            mapRef.current.flyTo(position, 18);
        }
    }, [position]);

    const ObterLocalizacao = useCallback(() => {
        let complaintLocation = location.state?.local;
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
                    alert("Erro ao obter localização. Verifique as permissões.");
                },
                { timeout: 10000 }
            );
        } else {
            console.error("Geolocalização não está disponível.");
            alert("Geolocalização não está disponível no seu navegador.");
        }
    }, [location.state]);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                handleChange('image', reader.result);
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
    }, [ObterLocalizacao]);

    const MapClickHandler = () => {
        useMapEvent({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        });
        return null;
    };

    const buscarEndereco = async () => {
        try {
            // formData.numero, formData.cep
            if (formData.rua === "" && formData.cidade === "", formData.estado === "", formData.pais === "") {
                alert('preencha todos os campos ')
                return
            }

            let resp = await getLatLongFromAddress(formData.rua, formData.numero, formData.cidade, formData.estado, formData.pais);
            setPosition([resp.latitude, resp.longitude]);

        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            alert("Erro ao buscar o endereço.");
        }
    };

    const handleSubmit = async () => {
        try {
            await buscarEndereco()

            let tk = localStorage.getItem('usuario')
            let us = DecodeToken(tk)

            let img = await uploadImage(formData.image, us.nome)

            const reportData = {
                latitude: position[0],
                longitude: position[1],
                titulo: formData.titulo,
                conteudo: formData.problema,
                imagem: img,
                user_id: us.id,
                data: new Date().toISOString(),
                adress: `${formData.numero} ${formData.rua}, ${formData.cidade}, ${formData.estado}, ${formData.cep}, ${formData.pais}`,
                prioridade: 5,
            };

            let resp = await createReport(reportData)

            if (resp.error) {
                alert(resp.error)
                return
            } else {
                navigate("/")
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert("Ocorreu um erro ao enviar a reclamação.");
        }
    };

    const handleChange = useCallback((field, value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
    }, []);

    return (
        <BaseContainer footer={false} flex={true}>
            <Form onSubmit={handleSubmit} className='d-block d-md-flex' style={{ flex: 1, margin: 0 }}>
                <section style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column', borderRightWidth: 2, borderRightStyle: 'solid' }} className='border-primary'>
                    <h3 className='text-primary-emphasis mb-3'>Crie uma nova reclamação</h3>

                    <Form.Group controlId="titulo" >
                        <Form.ControlLabel className='text-primary-emphasis bold fs-5'>Título</Form.ControlLabel>
                        <Form.Control
                            name="titulo"
                            style={{ borderWidth: 2, width: '100%' }}
                            className="border-primary fs-5"
                            value={formData.titulo}
                            onChange={(value) => handleChange('titulo', value)}
                            required
                        />
                        <Form.HelpText className='text-dark-emphasis'>Uma descrição curta que indique seu problema</Form.HelpText>
                    </Form.Group>

                    <Form.Group controlId="problema" >
                        <Form.ControlLabel className="text-primary-emphasis bold fs-5">Informe o seu problema</Form.ControlLabel>
                        <Form.Control
                            className="border-primary fs-5"
                            rows={5}
                            name="problema"
                            accepter={Textarea}
                            value={formData.problema}
                            onChange={(value) => handleChange('problema', value)}
                            required
                            style={{ resize: 'none', borderWidth: 2, width: '100%' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="image" >
                        <Form.ControlLabel className='text-primary-emphasis bold fs-5'>Carregue uma imagem do local e/ou problema</Form.ControlLabel>
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
                        <Form.HelpText className='text-dark-emphasis' >Selecione uma imagem da galeria ou tire uma foto.</Form.HelpText>
                    </Form.Group>
                </section>

                <section style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column', borderLeftWidth: 2, borderLeftStyle: 'solid' }} className='border-primary'>
                    <h3 className='text-primary-emphasis mb-3'>Informações do local</h3>

                    <div style={{ width: "100%", height: 300 }}>
                        {position ? (
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
                                <span className="text-primary bold">Carregando Mapa...</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                        <Form.Group controlId="numero" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary-emphasis bold fs-5'>Número</Form.ControlLabel>
                            <Form.Control
                                name="numero"
                                style={{ borderWidth: 2, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.numero}
                                onChange={(value) => handleChange('numero', value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="rua" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary-emphasis bold fs-5'>Rua</Form.ControlLabel>
                            <Form.Control
                                name="rua"
                                style={{ borderWidth: 2, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.rua}
                                onChange={(value) => handleChange('rua', value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                        <Form.Group controlId="cep" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary-emphasis bold fs-5'>CEP</Form.ControlLabel>
                            <Form.Control
                                name="cep"
                                style={{ borderWidth: 2, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.cep}
                                onChange={(value) => handleChange('cep', value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="cidade" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary-emphasis bold fs-5'>Cidade</Form.ControlLabel>
                            <Form.Control
                                name="cidade"
                                style={{ borderWidth: 2, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.cidade}
                                onChange={(value) => handleChange('cidade', value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                        <Form.Group controlId="estado" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary-emphasis bold fs-5'>Estado</Form.ControlLabel>
                            <Form.Control
                                name="estado"
                                style={{ borderWidth: 2, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.estado}
                                onChange={(value) => handleChange('estado', value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="pais" style={{ flex: 1, width: '100%' }}>
                            <Form.ControlLabel className='text-primary-emphasis bold fs-5'>País</Form.ControlLabel>
                            <Form.Control
                                name="pais"
                                style={{ borderWidth: 2, width: '100%' }}
                                className="border-primary fs-5"
                                value={formData.pais}
                                onChange={(value) => handleChange('pais', value)}
                                required
                            />
                        </Form.Group>
                    </div>

                    <Form.Group>
                        <ButtonToolbar>
                            <button className='btn btn-primary' type="submit" style={{ marginTop: 15 }}>
                                Enviar Reclamação
                            </button>
                            <button className='btn btn-warning' type='button' onClick={buscarEndereco} style={{ marginTop: 15 }}>
                                Verificar Endereço
                            </button>
                        </ButtonToolbar>
                    </Form.Group>
                </section>
            </Form>
        </BaseContainer>
    );
}
