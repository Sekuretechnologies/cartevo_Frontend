'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import {store, persistor} from '@/redux/store'; // Adjust the path according to your project structure
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from 'react-query';

export default function StoreProvider({ children }:any) {
  const storeRef = useRef(store);
  const queryClientRef = useRef<QueryClient>();
  
  if (!storeRef.current) {
    storeRef.current = store;
  }
  
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          cacheTime: 10 * 60 * 1000, // 10 minutes
        },
      },
    });
  }

  return (
    <Provider store={storeRef.current}> 
       <PersistGate loading={null} persistor={persistor}>
       <QueryClientProvider client={queryClientRef.current}>
        {children}
       </QueryClientProvider>
       </PersistGate>
     </Provider>
    );
}

