
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useApp } from './LocalAppContext';
import { toast } from '@/hooks/use-toast';

interface SyncContextType {
  isServer: boolean;
  isConnected: boolean;
  connectedClients: number;
  serverUrl: string;
  startAsServer: () => void;
  connectToServer: (url: string) => void;
  disconnect: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isServer, setIsServer] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedClients, setConnectedClients] = useState(0);
  const [serverUrl, setServerUrl] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const serverRef = useRef<any>(null);
  const { participants, transactions, booths, addParticipant, addTransaction, updateParticipant } = useApp();

  const getLocalIP = () => {
    return `${window.location.hostname}:${window.location.port || '3000'}`;
  };

  const broadcastToClients = (data: any) => {
    if (serverRef.current && serverRef.current.clients) {
      serverRef.current.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  };

  const startAsServer = () => {
    try {
      console.log('Iniciando servidor de sincronização...');
      
      // Simular servidor WebSocket usando BroadcastChannel para comunicação local
      const channel = new BroadcastChannel('festa-sync');
      
      serverRef.current = {
        clients: new Set(),
        channel: channel
      };

      channel.onmessage = (event) => {
        const { type, data, clientId } = event.data;
        
        if (type === 'client-connect') {
          serverRef.current.clients.add({ id: clientId, send: (msg: string) => {
            channel.postMessage({ type: 'server-message', data: JSON.parse(msg), targetClient: clientId });
          }});
          setConnectedClients(serverRef.current.clients.size);
          
          // Enviar dados atuais para o novo cliente
          channel.postMessage({
            type: 'initial-sync',
            data: { participants, transactions, booths },
            targetClient: clientId
          });
          
          toast({
            title: "Cliente conectado!",
            description: "Um dispositivo se conectou ao servidor",
          });
        }
        
        if (type === 'client-disconnect') {
          serverRef.current.clients.forEach((client: any) => {
            if (client.id === clientId) {
              serverRef.current.clients.delete(client);
            }
          });
          setConnectedClients(serverRef.current.clients.size);
        }
        
        if (type === 'sync-data') {
          // Processar dados recebidos do cliente
          if (data.participants) {
            data.participants.forEach((participant: any) => {
              addParticipant(participant);
            });
          }
          
          if (data.transactions) {
            data.transactions.forEach((transaction: any) => {
              addTransaction(transaction);
            });
          }
          
          // Reenviar para outros clientes
          broadcastToClients({ type: 'data-update', data });
        }
      };

      setIsServer(true);
      setIsConnected(true);
      setServerUrl(getLocalIP());
      
      toast({
        title: "Servidor iniciado!",
        description: "Outros dispositivos podem se conectar agora",
      });
      
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      toast({
        title: "Erro",
        description: "Erro ao iniciar servidor de sincronização",
        variant: "destructive",
      });
    }
  };

  const connectToServer = (url: string) => {
    try {
      console.log('Conectando ao servidor:', url);
      
      if (url === 'localhost' || url === getLocalIP()) {
        // Conectar via BroadcastChannel para teste local
        const channel = new BroadcastChannel('festa-sync');
        const clientId = Math.random().toString(36).substr(2, 9);
        
        channel.onmessage = (event) => {
          const { type, data, targetClient } = event.data;
          
          if ((targetClient && targetClient === clientId) || !targetClient) {
            if (type === 'initial-sync') {
              // Receber dados iniciais do servidor
              if (data.participants) {
                data.participants.forEach((participant: any) => addParticipant(participant));
              }
              if (data.transactions) {
                data.transactions.forEach((transaction: any) => addTransaction(transaction));
              }
              
              toast({
                title: "Sincronização completa!",
                description: "Dados sincronizados com o servidor",
              });
            }
            
            if (type === 'data-update') {
              // Receber atualizações do servidor
              if (data.participants) {
                data.participants.forEach((participant: any) => addParticipant(participant));
              }
              if (data.transactions) {
                data.transactions.forEach((transaction: any) => addTransaction(transaction));
              }
            }
          }
        };
        
        // Notificar servidor da conexão
        channel.postMessage({ type: 'client-connect', clientId });
        
        socketRef.current = {
          close: () => {
            channel.postMessage({ type: 'client-disconnect', clientId });
            channel.close();
          },
          send: (data: string) => {
            channel.postMessage({ type: 'sync-data', data: JSON.parse(data), clientId });
          }
        } as any;
        
        setIsConnected(true);
        setServerUrl(url);
        
        toast({
          title: "Conectado!",
          description: "Conectado ao servidor de sincronização",
        });
      } else {
        // Tentar conexão WebSocket real
        const ws = new WebSocket(`ws://${url}/sync`);
        
        ws.onopen = () => {
          setIsConnected(true);
          setServerUrl(url);
          socketRef.current = ws;
          
          toast({
            title: "Conectado!",
            description: "Conectado ao servidor de sincronização",
          });
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'sync' && data.participants) {
              data.participants.forEach((participant: any) => addParticipant(participant));
            }
            
            if (data.type === 'sync' && data.transactions) {
              data.transactions.forEach((transaction: any) => addTransaction(transaction));
            }
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
          }
        };
        
        ws.onerror = () => {
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao servidor",
            variant: "destructive",
          });
        };
        
        ws.onclose = () => {
          setIsConnected(false);
          setServerUrl('');
          socketRef.current = null;
          
          toast({
            title: "Desconectado",
            description: "Conexão com servidor perdida",
            variant: "destructive",
          });
        };
      }
      
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: "Erro",
        description: "Erro ao conectar ao servidor",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (serverRef.current) {
      if (serverRef.current.channel) {
        serverRef.current.channel.close();
      }
      serverRef.current = null;
    }
    
    setIsServer(false);
    setIsConnected(false);
    setConnectedClients(0);
    setServerUrl('');
    
    toast({
      title: "Desconectado",
      description: "Sincronização desativada",
    });
  };

  // Sincronizar dados quando houver mudanças
  useEffect(() => {
    if (isConnected && socketRef.current) {
      const syncData = {
        participants,
        transactions,
        timestamp: new Date().toISOString()
      };
      
      try {
        socketRef.current.send(JSON.stringify(syncData));
      } catch (error) {
        console.error('Erro ao sincronizar dados:', error);
      }
    }
  }, [participants, transactions, isConnected]);

  const value = {
    isServer,
    isConnected,
    connectedClients,
    serverUrl,
    startAsServer,
    connectToServer,
    disconnect
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
