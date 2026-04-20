import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { useBusiness } from '../context/BusinessContext';
import './Tab2.css';

const MapResizer = () => {
  const map = useMap();
  useIonViewDidEnter(() => {
    map.invalidateSize();
  });
  return null;
};

const Tab2: React.FC = () => {
  const { results } = useBusiness();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mapa Expandido</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <MapContainer 
          center={[-23.5505, -46.6333]} 
          zoom={17} 
          style={{ height: '100%', width: '100%' }}
        >
          <MapResizer />
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"/>

          {/* Renderiza os mesmos ícones da Tab 1 */}
          {results.map((empresa, index) => (
            <Marker key={index} position={[Number(empresa.lat), Number(empresa.lng)]}>
              <Popup>
                <strong>{empresa.name}</strong><br/>
                {empresa.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;