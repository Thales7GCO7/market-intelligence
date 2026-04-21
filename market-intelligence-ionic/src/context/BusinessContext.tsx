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
  segment: string;
  setSegment: (s: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [results, setResults] = useState<Business[]>([]);
  const [segment, setSegment] = useState('');
  return (
    <BusinessContext.Provider value={{ results, setResults, segment, setSegment }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness deve ser usado dentro de um BusinessProvider');
  return context;
};