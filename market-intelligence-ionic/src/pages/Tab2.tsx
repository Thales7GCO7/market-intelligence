import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { useBusiness } from '../context/BusinessContext';
import { LatLngExpression } from 'leaflet';
import '../map-setup';
import './Tab2.css';

const MapResizer = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useIonViewDidEnter(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.setView(center, 15);
    }, 100);
  });

  return null;
};

const Tab2: React.FC = () => {
  const { results } = useBusiness();
  
  const [userPos, setUserPos] = useState<[number, number]>([-23.0264, -45.5552]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(newPos);
      });
    }
  }, []);

  const dynamicCenter: [number, number] = results.length > 0 
    ? [Number(results[0].lat), Number(results[0].lng)] 
    : userPos;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Exploração de Mercado</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <MapContainer 
          center={dynamicCenter} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
        >
          <MapResizer center={dynamicCenter} />
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />

          {!results.length && (
            <Marker position={userPos}>
              <Popup>Você está aqui</Popup>
            </Marker>
          )}

          {results.map((empresa, index) => (
            <Marker 
              key={index} 
              position={[Number(empresa.lat), Number(empresa.lng)]}
            >
              <Popup>
                <div style={{ minWidth: '150px' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{empresa.name}</h3>
                  <p style={{ margin: '0' }}>Nota: <strong>{empresa.rating} ⭐</strong></p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{empresa.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;