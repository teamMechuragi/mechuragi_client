'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

type LoadingType = 'AI' | 'TASTE' | 'DEFAULT';

const LoadingContext = createContext({
  startLoading: (type: LoadingType) => {},
  stopLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingType, setLoadingType] = useState<LoadingType | null>(null);

  const startLoading = (type: LoadingType) => setLoadingType(type);
  const stopLoading = () => setLoadingType(null);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      {loadingType && <LoadingSpinner type={loadingType} />}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);