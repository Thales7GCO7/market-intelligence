import React, { createContext, useState, useContext } from 'react';

interface Business {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  review_count: number;
}

interface BusinessContextType {
  results: Business[];
  setResults: (data: Business[]) => void;
  segmento: string;
  setSegmento: (s: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [results, setResults] = useState<Business[]>([]);
  const [segmento, setSegmento] = useState('');
  return (
    <BusinessContext.Provider value={{ results, setResults, segmento, setSegmento }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness deve ser usado dentro de um BusinessProvider');
  return context;
};