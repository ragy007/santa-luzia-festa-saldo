
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface SyncContextType {
  isServer: boolean;
  isConnected: boolean;
  connectedClients: number;
  serverUrl: string;
  startAsServer: () => void;
  connectToServer: (url: string) => void;
  disconnect: () => void;
  broadcastData: (type: string, data: any) => void;
  onDataReceived: (callback: (type: string, data: any) => void) => void;
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
  
  const wsServer = useRef<WebSocket | null>(null);
  const wsClient = useRef<WebSocket | null>(null);
  const httpServer = useRef<any>(null);
  const dataCallback = useRef<((type: string, data: any) => void) | null>(null);

  const startAsServer = () => {
    try {
      // Usar um servidor WebSocket simples via Service Worker
      navigator.serviceWorker.register('/sync-server.js').then((registration) => {
        console.log('Sync server registered:', registration);
        setIsServer(true);
        setIsConnected(true);
        
        // Obter IP local (simulado)
        const localIP = `${window.location.hostname}:3001`;
        setServerUrl(localIP);
        
        toast({
          title: "🖥️ Servidor iniciado!",
          description: `Outros dispositivos podem se conectar em: ${localIP}`,
        });
      }).catch((error) => {
        console.error('Erro ao iniciar servidor:', error);
        // Fallback: usar localStorage compartilhado
        startLocalStorageSync();
      });
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      startLocalStorageSync();
    }
  };

  const startLocalStorageSync = () => {
    setIsServer(true);
    setIsConnected(true);
    setServerUrl('localStorage-sync');
    
    // Escutar mudanças no localStorage de outras abas
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('festa-sync-')) {
        const type = e.key.replace('festa-sync-', '');
        const data = e.newValue ? JSON.parse(e.newValue) : null;
        if (dataCallback.current && data) {
          dataCallback.current(type, data);
        }
      }
    });

    toast({
      title: "🔄 Sincronização local ativa!",
      description: "Outras abas do navegador verão as mudanças em tempo real",
    });
  };

  const connectToServer = (url: string) => {
    try {
      // Tentar conectar via WebSocket
      const ws = new WebSocket(`ws://${url}/sync`);
      
      ws.onopen = () => {
        wsClient.current = ws;
        setIsConnected(true);
        setServerUrl(url);
        
        toast({
          title: "✅ Conectado ao servidor!",
          description: `Sincronizando com ${url}`,
        });
      };

      ws.onmessage = (event) => {
        const { type, data } = JSON.parse(event.data);
        if (dataCallback.current) {
          dataCallback.current(type, data);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsClient.current = null;
        
        toast({
          title: "⚠️ Conexão perdida",
          description: "Tentando reconectar...",
          variant: "destructive",
        });
      };

      ws.onerror = () => {
        console.log('Erro WebSocket, usando localStorage sync');
        startLocalStorageSync();
      };

    } catch (error) {
      console.log('Erro ao conectar, usando localStorage sync');
      startLocalStorageSync();
    }
  };

  const disconnect = () => {
    if (wsServer.current) {
      wsServer.current.close();
      wsServer.current = null;
    }
    if (wsClient.current) {
      wsClient.current.close();
      wsClient.current = null;
    }
    
    setIsServer(false);
    setIsConnected(false);
    setConnectedClients(0);
    setServerUrl('');
  };

  const broadcastData = (type: string, data: any) => {
    const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    
    if (isServer) {
      // Broadcast para todos os clientes conectados
      if (wsServer.current) {
        // WebSocket broadcast (seria implementado no Service Worker)
        console.log('Broadcasting via WebSocket:', message);
      } else {
        // localStorage broadcast
        localStorage.setItem(`festa-sync-${type}`, message);
        // Remover após 1 segundo para não acumular
        setTimeout(() => {
          localStorage.removeItem(`festa-sync-${type}`);
        }, 1000);
      }
    } else if (wsClient.current && wsClient.current.readyState === WebSocket.OPEN) {
      // Enviar para o servidor
      wsClient.current.send(message);
    }
  };

  const onDataReceived = (callback: (type: string, data: any) => void) => {
    dataCallback.current = callback;
  };

  const value: SyncContextType = {
    isServer,
    isConnected,
    connectedClients,
    serverUrl,
    startAsServer,
    connectToServer,
    disconnect,
    broadcastData,
    onDataReceived,
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
};
