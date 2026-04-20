import React, { useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonIcon } from '@ionic/react';
import { trendingUpOutline, alertCircleOutline, businessOutline } from 'ionicons/icons';
import { useBusiness } from '../context/BusinessContext';
import './Tab3.css';

const Tab3: React.FC = () => {
  const { results, segmento } = useBusiness();

  const metrics = useMemo(() => {
  const total = results.length;
  if (total === 0) return { total: 0, media: "0.0", gap: 0, oportunidade: "0.0" };

  const somaRating = results.reduce((acc, curr) => acc + (parseFloat(String(curr.rating)) || 0), 0);
  const mediaCalculada = somaRating / total;
  const gap = results.filter(b => (parseFloat(String(b.rating)) || 0) < 4.0).length;
  
  // Se a média é 4.1, a oportunidade base é 0.9. Se a média é 2.0, a oportunidade base é 3.0.
  // Multiplicamos por 2 para chegar na escala de 0 a 10.
  let oportunidadeCalculada = (5 - mediaCalculada) * 2;

  // Bonus de oportunidade, caso houver muitos "gaps" (locais ruins)
  oportunidadeCalculada += (gap / total) * 2;

  return { 
    total, 
    media: mediaCalculada.toFixed(1), 
    gap, 
    oportunidade: Math.min(Math.max(oportunidadeCalculada, 0), 10).toFixed(1) 
  };
  }, [results]);

  if (results.length === 0) {
    return (
      <IonPage>
        <IonHeader><IonToolbar color="primary"><IonTitle>Market Intelligence</IonTitle></IonToolbar></IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <p>Realize uma pesquisa na Tab 1 para gerar o relatório.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>BI Report: {segmento || 'Geral'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        {/* Card de Score Global */}
        <IonCard mode="ios" color="light">
          <IonCardHeader>
            <IonCardSubtitle>Score de Viabilidade para {segmento}</IonCardSubtitle>
            <IonCardTitle style={{ fontSize: '28px' }}>
              {metrics.oportunidade}/10
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <strong>Diagnóstico:</strong> {Number(metrics.oportunidade) < 5 
              ? `Mercado de ${segmento} altamente competitivo e com players bem avaliados.`
              : `O setor de ${segmento} nesta região possui uma lacuna de qualidade. Excelente para novos entrantes.`}
          </IonCardContent>
        </IonCard>

        {/* Análise Quantitativa */}
        <IonCard mode="ios">
          <IonCardHeader>
            <IonCardTitle>Análise Técnica</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonIcon icon={businessOutline} slot="start" />
                <IonLabel>
                  <h2>Amostragem</h2>
                  <p>{metrics.total} {segmento}s analisados</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={trendingUpOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>Rating Médio do Setor</h2>
                  <p>{metrics.media} estrelas</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={alertCircleOutline} slot="start" color="warning" />
                <IonLabel>
                  <h2>Pontos de Atenção</h2>
                  <p>{metrics.gap} locais com nota baixa (Sub-4)</p>
                </IonLabel>
                <IonBadge color="success">Oportunidade</IonBadge>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Diretriz Estratégica Customizada */}
        <div className="ion-padding">
          <h3 style={{ fontWeight: 'bold' }}>Diretriz para o segmento de {segmento}:</h3>
          <p style={{ color: '#555', lineHeight: '1.5' }}>
            Baseado nos {metrics.total} estabelecimentos de <strong>{segmento}</strong> identificados, 
            a estratégia recomendada é focar no 
            {parseFloat(metrics.media) > 4.0 
              ? ` diferencial de preço ou conveniência, já que a satisfação média é alta (${metrics.media}).` 
              : ` aumento da qualidade percebida, dado que o mercado local falha em entregar excelência (Média: ${metrics.media}).`
            }
          </p>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab3;