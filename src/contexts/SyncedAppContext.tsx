
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
            // Usar setState diretamente para evitar loops
            setParticipants(prev => [...prev, data]);
          }
          break;
          
        case 'transaction-added':
          // Verificar se já existe antes de adicionar
          const existingTransaction = transactions.find(t => t.id === data.id);
          if (!existingTransaction) {
            console.log('Adicionando transação via sync:', data);
            setTransactions(prev => [...prev, data]);
            
            // Atualizar saldo do participante
            if (data.participantId) {
              const participant = participants.find(p => p.id === data.participantId);
              if (participant) {
                const newBalance = participant.balance + 
                  (data.type === 'credit' ? data.amount : -data.amount);
                updateParticipant(data.participantId, { balance: newBalance });
              }
            }
          }
          break;
          
        case 'participant-updated':
          console.log('Atualizando participante via sync:', data);
          updateParticipant(data.id, data.updates);
          break;
      }
    });
  }, [onDataReceived, participants, transactions]);

  // Override das funções para incluir broadcast
  const syncedAddParticipant = (participant: any) => {
    const newParticipant = {
      ...participant,
      id: generateUUID(),
      qrCode: participant.cardNumber,
      createdAt: new Date().toISOString()
    };
    
    addParticipant(newParticipant);
    broadcastData('participant-added', newParticipant);
  };

  const syncedAddTransaction = (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: generateUUID(),
      timestamp: new Date().toISOString()
    };
    
    addTransaction(newTransaction);
    broadcastData('transaction-added', newTransaction);
  };

  const syncedUpdateParticipant = (id: string, updates: any) => {
    updateParticipant(id, updates);
    broadcastData('participant-updated', { id, updates });
  };

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

// Helper function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Função para acessar setState diretamente (seria implementada no contexto principal)
const setParticipants = (updater: any) => {
  // Esta função seria implementada no LocalAppContext
  console.log('setParticipants chamado:', updater);
};

const setTransactions = (updater: any) => {
  // Esta função seria implementada no LocalAppContext
  console.log('setTransactions chamado:', updater);
};
