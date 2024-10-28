import React from 'react';
import NavigationRouter from './app/components/navigation';
import L from 'leaflet';

import './app/styles/style.css'
import 'leaflet/dist/leaflet.css';
import 'rsuite/dist/rsuite.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function App() {
  return (
    <NavigationRouter />
  );
}

export default App;
