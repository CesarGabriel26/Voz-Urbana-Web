import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Footer, Loader } from 'rsuite';
import NavigationBar from '../../components/navigationBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { listReports } from '../../utils/Api';

import L from 'leaflet';
import GeoIcon from '../../assets/GeoIcon.svg';
import ReportCard from '../../components/ReportCard';

const geoIcon = L.icon({
  iconUrl: GeoIcon,
  iconSize: [38, 38], // Tamanho do ícone
  iconAnchor: [22, 94], // Ponto de ancoragem
  popupAnchor: [-3, -76] // Ponto de ancoragem do popup em relação ao ícone
});

export default function Reclamacoes() {
  const [complaints, setComplaints] = useState([]);
  const [position, setPosition] = useState(null);

  const [loaded, setloaded] = useState(false);
  // const [isSticky, setIsSticky] = useState(false);

  const loadList = async () => {
    try {
      setloaded(false)
      let rest = await listReports()

      if (!rest.error) {
        setComplaints(rest.content)
      }
      setloaded(true)
    } catch (error) {
      setloaded(false)
      console.log(error);
    }
  }
  const ObterLocalizacao = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation não está disponível.");
    }
  }
  // const ControleScrollHeader = () => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 50) {
  //       setIsSticky(true);
  //     } else {
  //       setIsSticky(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }

  useEffect(() => {
    ObterLocalizacao()
    loadList()
  }, []);
  // useEffect(() => {
  //   ControleScrollHeader()
  // });

  return (
    <Container style={{
      height: '100vh',
      // paddingTop: isSticky ? 80 : 0,
    }}>
      <Header
        style={{
          // position: isSticky ? 'fixed' : 'relative',
          top: 0,
          width: '100%',
          zIndex: 1000,
          transition: '3.s ease-in-out',
        }}
      >
        <NavigationBar />
      </Header>
      <Content style={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 79px)' }} >
        <section style={{ width: '50%', padding: 15 }} >
          <h3 className='primary-text mb-3' >Reclamações Recentes</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 25, overflowY: 'scroll', height: "calc(95% - 10px)" }} >
            {
              loaded ? (
                complaints.map((complaint, index) => (
                  <ReportCard complaint={complaint} key={index}/>
                ))
              ) : <Loader size="md" />
            }
          </div>
        </section>
        <section style={{ width: '50%', height: 'calc(100vh - 79px)' }} >
          {
            position ? (
              <MapContainer center={position} zoom={13} style={{ width: "100%", height: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {
                  loaded ? (
                    complaints.map((complaint, index) => (
                      <Marker index={index} position={[complaint.latitude, complaint.longitude]} icon={geoIcon} style={{ color: 'red' }}>
                        <Popup>
                          {complaint.titulo}
                        </Popup>
                      </Marker>
                    ))
                  ) : null
                }
              </MapContainer>
            ) : null
          }
        </section>
      </Content>
      <Footer></Footer>
    </Container>
  );
}
