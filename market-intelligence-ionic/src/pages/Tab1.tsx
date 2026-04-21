import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, 
  IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, 
  IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonListHeader 
} from '@ionic/react';
import { businessOutline, star, trendingUpOutline, locationOutline } from 'ionicons/icons';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useBusiness } from '../context/BusinessContext';
import '../map-setup';
import './Tab1.css';

const Tab1: React.FC = () => {
  const { results, setResults, segment, setSegment } = useBusiness();
  const [loading, setLoading] = useState<boolean>(false);
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({
    lat: -23.0264, 
    lng: -45.5552
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          console.log("Localização atualizada:", pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.warn("Erro ao obter localização, usando padrão:", error.message);
        }
      );
    }
  }, []);

  const searchMarket = async () => {
    if (!segment) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/businesses`, {
        params: { 
          lat: userLocation.lat, 
          lng: userLocation.lng, 
          segment: segment,
          radius: 5000 //  km
        }
      });

      if (response.data.results) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error('Erro na API:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = results.length > 0 
    ? (results.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / results.length).toFixed(1)
    : "0.0";

  const mapCenter: LatLngExpression = results.length > 0 
    ? [Number(results[0].lat), Number(results[0].lng)] 
    : [userLocation.lat, userLocation.lng];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Market Intelligence</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="search-container" style={{ padding: '10px' }}>
          <IonSearchbar 
            value={segment} 
            onIonInput={(e) => setSegment(e.detail.value ?? '')}
            placeholder="Ex: Farmácia, Café, Padaria..."
          />
          <IonButton expand="block" onClick={searchMarket} disabled={loading}>
            {loading ? 'Analisando...' : 'Pesquisar Mercado'}
          </IonButton>
          <p style={{ fontSize: '10px', textAlign: 'center', color: '#666' }}>
            <IonIcon icon={locationOutline} /> Buscando próximo a você
          </p>
        </div>

        {results.length > 0 && (
          <>
            <div className="map-wrapper" style={{ height: '300px', margin: '10px', borderRadius: '15px', overflow: 'hidden' }}>
              <MapContainer 
                center={mapCenter} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; CARTO'
                />
                
                <Marker position={[userLocation.lat, userLocation.lng]}>
                   <Popup>Você está aqui</Popup>
                </Marker>

                {results.map((business, index) => (
                  <Marker 
                    key={index} 
                    position={[Number(business.lat), Number(business.lng)]}
                  >
                    <Popup>
                      <strong>{business.name}</strong><br/>
                      Nota: {business.rating} ⭐
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonCard className="insight-card">
                    <IonCardContent style={{ textAlign: 'center' }}>
                      <IonIcon icon={trendingUpOutline} color="primary" style={{ fontSize: '24px' }} />
                      <p><small>Empresas</small></p>
                      <h2 style={{ margin: 0 }}>{results.length}</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard className="insight-card">
                    <IonCardContent style={{ textAlign: 'center' }}>
                      <IonIcon icon={star} color="warning" style={{ fontSize: '24px' }} />
                      <p><small>Média Rating</small></p>
                      <h2 style={{ margin: 0 }}>{averageRating}</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>

            <IonList>
              <IonListHeader>
                <IonLabel>Concorrentes Encontrados</IonLabel>
              </IonListHeader>
              {results.map((market, idx) => (
                <IonItem key={idx} lines="full">
                  <IonIcon icon={businessOutline} slot="start" color="medium" />
                  <IonLabel>
                    <h3>{market.name}</h3>
                    <p>{market.address}</p>
                  </IonLabel>
                  <IonBadge color={market.rating >= 4.5 ? "success" : "primary"} slot="end">
                    {market.rating} ⭐
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;