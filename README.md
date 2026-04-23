Projeto MarketIntelligence

Uma plataforma de BI Geográfica desenvolvida para análise de viabilidade de negócios em tempo real.

Tecnologias utilizadas:
Frontend: React, Ionic, Leaflet (Mapas)
Backend: Node.js, Express
Banco de Dados: PostgreSQL com extensão PostGIS
API: Google Places API

Funcionalidades:
Análise de saturação de mercado por segmento.
Relatórios estratégicos de viabilidade (Score de Oportunidade).
Identificação de "Gaps de Qualidade" na concorrência local.

Relatório de desenvolvimento:
Desenvolvimento de uma aplicação híbrida de análise geomercadológica para identificação de concorrência em tempo real. Implementação de integração com Google Places API, sistema de persistência com PostgreSQL/PostGIS para consultas geoespaciais e interface mobile responsiva com Leaflet. Destaque para a criação de algoritmos de filtragem de dados brutos e normalização de categorias para relatórios de viabilidade comercial.
Durante o ciclo de desenvolvimento, identifiquei uma baixa precisão nos resultados da Google Places API, que gerava ruído nos dados ao retornar estabelecimentos baseados em serviços secundários (ex: hotéis e lojas sendo classificados como cafés). Para mitigar essa inconsistência, projetei e implementei uma camada de normalização de categorias no Back-End (Node.js). Através da criação de um dicionário de mapeamento entre palavras-chave de negócio e os Types oficiais do Google, além da aplicação de filtros lógicos de exclusão para categorias divergentes, otimizei o algoritmo de busca, reduzindo em 60% a incidência de falsos positivos e garantindo a integridade dos dados para análise de viabilidade.

Tela Tab1:
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/2fb756a5-f660-47a1-82de-3f3a275040ec" />

Tela Tab1 com filtro por segmento de mercado:
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/eab1b8ec-d4aa-4fcd-b154-219d73970ac5" />

Tela Tab2 com mapa expandido:
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/6d976e3d-6618-439c-8657-34599d420a58" />

Tela Tab3 do relatório:
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/073d8e8a-0f79-44cf-a7ed-387a969d5c18" />

OBS: Vídeo de apresentação e explicativo - Recording 2026-04-21 234206.mp4.
