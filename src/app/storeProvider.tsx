'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import {store, persistor} from '@/redux/store'; // Adjust the path according to your project structure
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from 'react-query';

export default function StoreProvider({ children }:any) {
  const storeRef = useRef(store);
  if (!storeRef.current) {
    storeRef.current = store;
  }
  const queryClient = new QueryClient();

  return (
    <Provider store={store}> 
       <PersistGate loading={null} persistor={persistor}>
       <QueryClientProvider client={queryClient}>
        {children}
       </QueryClientProvider>
       </PersistGate>
     </Provider>
    );
}

