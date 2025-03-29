'use client'
import { Provider } from 'react-redux';
import { store } from '../(store)/Store/Store';
import { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react";

interface ReduxProviderProps {
  children: ReactNode;
}
export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <SessionProvider>
    <Provider store={store}>
      {children}
    </Provider>
    </SessionProvider>

  );
}
