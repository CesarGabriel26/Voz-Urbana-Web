import React, { useEffect, useState, useRef } from 'react';
import { Loader, Input } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

import { listReports } from '../../utils/Api';

import ReportCard from '../../components/ReportCard';
import BaseContainer from '../../components/BaseContainer';

export default function Reclamacoes() {
  const location = useLocation();

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [position, setPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loaded, setLoaded] = useState(false);

  const mapRef = useRef();

  const loadList = async () => {
    try {
      setLoaded(false)
      let rest = await listReports()

      if (!rest.error) {
        setComplaints(rest.content)
        setFilteredComplaints(rest.content);
      }
      setLoaded(true)
    } catch (error) {
      setLoaded(false)
      console.log(error);
    }
  }

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
    ObterLocalizacao()
    loadList()
  }, []);

  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.flyTo(position, 18);
    }
  }, [position]);

  return (
    <BaseContainer flex={true} footer={false}  >
      {/* Seção de Reclamações */}
      <section style={{ flex: 1, padding: 15, display: 'flex', flexDirection: 'column', borderRightWidth: 2, borderRightStyle: 'solid' }} className='border-primary'>
        <h3 className='text-primary mb-3'>Reclamações Recentes</h3>

        {/* Barra de pesquisa */}
        <Input
          value={searchTerm}
          onChange={handleSearch}
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

      {/* Seção do Mapa */}
      <section className='d-none d-md-block border-primary' style={{ flex: 1, borderLeftWidth: 2, borderLeftStyle: 'solid' }}>
        {
          position ? (
            <MapContainer center={position} zoom={18} style={{ width: '100%', height: '100%' }} ref={mapRef} >
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
              <p className='dark-text' >
                Algo deu errado, verifique a permição de geolocalização, caso ja tenha permitido recarregue a pagina.
              </p>
            </div>
          )
        }
      </section>
    </BaseContainer>
  );
}
