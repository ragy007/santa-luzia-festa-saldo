
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './LocalAppContext';
import { SyncProvider, useSync } from './LocalSyncContext';

const SyncIntegration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { broadcastData, onDataReceived } = useSync();
  const { 
    addParticipant, 
    addTransaction, 
    updateParticipant,
    participants,
    transactions 
  } = useApp();

  useEffect(() => {
    // Configurar listener para dados recebidos
    onDataReceived((type: string, data: any) => {
      console.log('Dados recebidos via sync:', type, data);
      
      switch (type) {
        case 'participant-added':
          // Verificar se já existe antes de adicionar
          const existingParticipant = participants.find(p => p.id === data.id);
          if (!existingParticipant) {
            console.log('Adicionando participante via sync:', data);
            addParticipant(data);
          }
          break;
          
        case 'transaction-added':
          // Verificar se já existe antes de adicionar
          const existingTransaction = transactions.find(t => t.id === data.id);
          if (!existingTransaction) {
            console.log('Adicionando transação via sync:', data);
            addTransaction(data);
          }
          break;
          
        case 'participant-updated':
          console.log('Atualizando participante via sync:', data);
          updateParticipant(data.id, data.updates);
          break;
      }
    });
  }, [onDataReceived, participants, transactions, addParticipant, addTransaction, updateParticipant]);

  return <>{children}</>;
};

export const SyncedAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SyncProvider>
      <AppProvider>
        <SyncIntegration>
          {children}
        </SyncIntegration>
      </AppProvider>
    </SyncProvider>
  );
};
