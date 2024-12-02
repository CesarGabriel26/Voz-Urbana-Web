import React, { useEffect, useState, useRef } from 'react';
import { Loader, Input } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import PriorityCard from '../../components/PriorityCard';
import DecodeToken from '../../utils/JWT';
import BaseContainer from '../../components/BaseContainer';
import { listReports } from '../../utils/Api';

export default function Reclamacoes() {
  const location = useLocation();
  const navigate = useNavigate();

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
      const rest = await listReports()

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
      <div style={{ maxHeight: 'calc(100vh - 92px)', display: 'flex', flexDirection: 'row', flex: 1 }}>
        <section
          style={{
            padding: 15,
            display: 'flex',
            maxWidth: '100vw',
            flexDirection: 'column',
            flex: 1
          }}
        >
          <div style={{ flex: 1 }} >
            <h3 className='text-primary-emphasis mb-3'>Suas Recentes</h3>
            <Input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Pesquisar reclamações..."
              style={{ marginBottom: 15 }}
            />
            {error && <Alert variant="danger">{error}</Alert>}
          </div>

          <div
            style={{
              flex: 6,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {
              loaded ? (
                filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint, i) => (
                    // <ReportCard
                    //     key={index}
                    //     complaint={complaint}
                    //     searchTerm={searchTerm}
                    //     buttons={[{
                    //         text: 'Ver no mapa',
                    //         onclick: () => { setPosition([complaint.latitude, complaint.longitude]) }
                    //     }]}
                    // />
                    <PriorityCard
                      key={i}
                      searchTerm={searchTerm}
                      prioridade={complaint.prioridade}
                      tittle={complaint.titulo}
                      date={complaint.data}
                      content={complaint.conteudo}
                      onPress={() => {
                        navigate("/Complaint-Details", { state: { complaintId: complaint.id } })
                      }}
                      noMax={true}
                      pressableText="ver mais"
                      style={{ marginTop: i === 0 ? 20 : 0, display: 'inline-block' }}
                      extraButtons={
                        [
                          {
                            pressableText: 'Ver no mapa',
                            onPress: () => {
                              setPosition([complaint.latitude, complaint.longitude])
                            }
                          }
                        ]
                      }
                    />
                  ))
                ) : <p className='text-dark-emphasis'>Nenhuma reclamação encontrada.</p>
              ) : <Loader size="md" />
            }
          </div>
        </section>

        <span class="border border-2 border-primary d-none d-md-block"></span>

        <section style={{ padding: 15, flex: 1, display: 'flex', flexDirection: 'column' }}
          className='d-none d-md-flex'
        >
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
                  Selecione uma reclamaçõ para vela no mapa
                </p>
              </div>
            )
          }
        </section>
      </div>
    </BaseContainer>
  );
}