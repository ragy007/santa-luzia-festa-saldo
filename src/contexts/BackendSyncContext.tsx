
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { Participant, Transaction, Product, Booth } from '@/types';

interface BackendSyncContextType {
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  apiUrl: string;
  wsUrl: string;
  connect: (apiUrl: string) => void;
  disconnect: () => void;
  
  // Participantes
  getParticipants: () => Promise<Participant[]>;
  addParticipant: (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => Promise<Participant>;
  updateParticipant: (id: string, updates: Partial<Participant>) => Promise<void>;
  
  // Transações
  getTransactions: () => Promise<Transaction[]>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<Transaction>;
  
  // Produtos e Barracas
  getProducts: () => Promise<Product[]>;
  getBooths: () => Promise<Booth[]>;
  
  // Callbacks para sincronização
  onParticipantAdded: (callback: (participant: Participant) => void) => void;
  onParticipantUpdated: (callback: (id: string, updates: Partial<Participant>) => void) => void;
  onTransactionAdded: (callback: (transaction: Transaction) => void) => void;
}

const BackendSyncContext = createContext<BackendSyncContextType | undefined>(undefined);

export const useBackendSync = () => {
  const context = useContext(BackendSyncContext);
  if (!context) {
    throw new Error('useBackendSync must be used within a BackendSyncProvider');
  }
  return context;
};

export const BackendSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [apiUrl, setApiUrl] = useState('http://localhost:3001');
  const [wsUrl, setWsUrl] = useState('ws://localhost:8080');
  
  const wsRef = useRef<WebSocket | null>(null);
  const participantCallbacks = useRef<Set<(participant: Participant) => void>>(new Set());
  const participantUpdateCallbacks = useRef<Set<(id: string, updates: Partial<Participant>) => void>>(new Set());
  const transactionCallbacks = useRef<Set<(transaction: Transaction) => void>>(new Set());

  const connect = async (newApiUrl: string) => {
    setConnectionStatus('connecting');
    setApiUrl(newApiUrl);
    
    try {
      // Testar conexão com API
      const response = await fetch(`${newApiUrl}/api/status`);
      if (!response.ok) throw new Error('API não disponível');
      
      const data = await response.json();
      console.log('API conectada:', data);
      
      // Conectar WebSocket
      const newWsUrl = newApiUrl.replace('http', 'ws').replace('3001', '8080');
      setWsUrl(newWsUrl);
      
      const ws = new WebSocket(newWsUrl);
      
      ws.onopen = () => {
        wsRef.current = ws;
        setIsConnected(true);
        setConnectionStatus('connected');
        toast({
          title: "✅ Conectado ao servidor!",
          description: "Sincronização em tempo real ativada",
        });
      };
      
      ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          console.log('Dados recebidos via WebSocket:', type, data);
          
          switch (type) {
            case 'participant-added':
              participantCallbacks.current.forEach(callback => callback(data));
              break;
            case 'participant-updated':
              participantUpdateCallbacks.current.forEach(callback => callback(data.id, data.updates));
              break;
            case 'transaction-added':
              transactionCallbacks.current.forEach(callback => callback(data));
              break;
          }
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        wsRef.current = null;
        toast({
          title: "⚠️ Conexão perdida",
          description: "Tentando reconectar...",
          variant: "destructive",
        });
      };
      
      ws.onerror = () => {
        setConnectionStatus('error');
        toast({
          title: "❌ Erro de conexão",
          description: "Não foi possível conectar ao servidor",
          variant: "destructive",
        });
      };
      
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "❌ Erro de conexão",
        description: "Verifique se o servidor está rodando",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    toast({
      title: "🔌 Desconectado",
      description: "Sincronização interrompida",
    });
  };

  // API Methods
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${apiUrl}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  };

  const getParticipants = () => apiCall('/participants');
  const addParticipant = (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => 
    apiCall('/participants', { method: 'POST', body: JSON.stringify(participant) });
  const updateParticipant = (id: string, updates: Partial<Participant>) => 
    apiCall(`/participants/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  
  const getTransactions = () => apiCall('/transactions');
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => 
    apiCall('/transactions', { method: 'POST', body: JSON.stringify(transaction) });
  
  const getProducts = () => apiCall('/products');
  const getBooths = () => apiCall('/booths');

  // Callback registration
  const onParticipantAdded = (callback: (participant: Participant) => void) => {
    participantCallbacks.current.add(callback);
    return () => participantCallbacks.current.delete(callback);
  };

  const onParticipantUpdated = (callback: (id: string, updates: Partial<Participant>) => void) => {
    participantUpdateCallbacks.current.add(callback);
    return () => participantUpdateCallbacks.current.delete(callback);
  };

  const onTransactionAdded = (callback: (transaction: Transaction) => void) => {
    transactionCallbacks.current.add(callback);
    return () => transactionCallbacks.current.delete(callback);
  };

  const value: BackendSyncContextType = {
    isConnected,
    connectionStatus,
    apiUrl,
    wsUrl,
    connect,
    disconnect,
    getParticipants,
    addParticipant,
    updateParticipant,
    getTransactions,
    addTransaction,
    getProducts,
    getBooths,
    onParticipantAdded,
    onParticipantUpdated,
    onTransactionAdded,
  };

  return (
    <BackendSyncContext.Provider value={value}>
      {children}
    </BackendSyncContext.Provider>
  );
};
