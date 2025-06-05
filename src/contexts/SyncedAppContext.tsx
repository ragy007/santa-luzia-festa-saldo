
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './LocalAppContext';
import { SyncProvider, useSync } from './LocalSyncContext';

const SyncIntegration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, isServer } = useSync();
  const { 
    addParticipant, 
    addTransaction, 
    updateParticipant,
    participants,
    transactions 
  } = useApp();

  // A sincronização agora é gerenciada automaticamente pelo LocalSyncContext
  // através dos useEffect que escutam mudanças nos dados
  useEffect(() => {
    if (isConnected) {
      console.log('Sincronização ativa - dados sendo compartilhados automaticamente');
    }
  }, [isConnected]);

  return <>{children}</>;
};

export const SyncedAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <SyncProvider>
        <SyncIntegration>
          {children}
        </SyncIntegration>
      </SyncProvider>
    </AppProvider>
  );
};
