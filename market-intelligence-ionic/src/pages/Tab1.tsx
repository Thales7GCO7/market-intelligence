import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, 
  IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon, 
  IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonListHeader 
} from '@ionic/react';
import { businessOutline, star, trendingUpOutline } from 'ionicons/icons';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useBusiness } from '../context/BusinessContext';
import '../map-setup';
import './Tab1.css';

const Tab1: React.FC = () => {
  const { results, setResults, segmento, setSegmento } = useBusiness();
  const [loading, setLoading] = useState<boolean>(false);

  const centerPosition: LatLngExpression = [-23.5505, -46.6333];

  const searchMarket = async () => {
    if (!segmento) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/businesses`, {
        params: { lat: -23.5505, lng: -46.6333, segmento: segmento, radius: 3000 }
      });
      console.log("Dados recebidos da API:", response.data.results);

      if (response.data.results && response.data.results.length > 0) {
        setResults(response.data.results);
      } else {
        console.warn("A API retornou uma lista vazia.");
        setResults([]);
      }

      setResults(response.data.results);
    } catch (error) {
      console.error('Erro na API:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = results.length > 0 
  ? (results.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / results.length).toFixed(1)
  : "0.0";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Market Intelligence</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="search-container">
          <IonSearchbar 
            value={segmento} 
            onIonInput={(e) => setSegmento(e.detail.value ?? '')}
            placeholder="Ex: Farmácia, Café, TI..."
          />
          <IonButton expand="block" onClick={searchMarket} disabled={loading}>
            {loading ? 'Analisando...' : 'Pesquisar Mercado'}
          </IonButton>
        </div>

        {results.length > 0 && (
          <>
            <div className="map-wrapper">
              <MapContainer center={centerPosition} zoom={14} scrollWheelZoom={false}>
                <TileLayer 
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {results.map((business, index) => {
                  const latitude = business.lat;
                  const longitude = business.lng;

                  if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
                    return (
                      <Marker 
                        key={index} 
                        position={[Number(latitude), Number(longitude)]}
                      >
                        <Popup>
                          <div style={{ minWidth: '150px' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{business.name}</h3>
                            <p style={{ margin: '0', fontSize: '14px' }}>
                              Nota: <strong>{business.rating} ⭐</strong>
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                              {business.address}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  } else {
                    console.warn(`Empresa ${business.name} ignorada. Dados recebidos:`, { lat: latitude, lng: longitude });
                    return null;
                  }
                })}
              </MapContainer>
            </div>

            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonCard className="insight-card">
                    <IonCardContent>
                      <IonIcon icon={trendingUpOutline} color="primary" />
                      <p><small>Empresas</small></p>
                      <h2>{results.length}</h2>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard className="insight-card">
                    <IonCardContent>
                      <IonIcon icon={star} color="warning" />
                      <p><small>Média Rating</small></p>
                      <h2>{averageRating}</h2>
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