import React, { useEffect, useState, useRef, } from 'react';
import { Container, Header, Content, Footer, Loader, Input } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

import { listReports } from '../../utils/Api';
import NavigationBar from '../../components/navigationBar';

import L from 'leaflet';
import GeoIcon from '../../assets/GeoIcon.svg';
import ReportCard from '../../components/ReportCard';

export default function AbaixoAssinados() {


  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ top: 0, width: '100%', zIndex: 1000 }}>
        <NavigationBar />
      </Header>
      <Content style={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 79px)' }}>
        {/* Seção de Reclamações */}
        <section style={{ flex: 1, padding: 15, display: 'flex', flexDirection: 'column', borderRightWidth: .5, borderRightColor: 'black', borderRightStyle: 'solid' }}>
          <div>
            <h1></h1>
          </div>
        </section>
      </Content>
      <Footer></Footer>
    </Container>
  );
}
