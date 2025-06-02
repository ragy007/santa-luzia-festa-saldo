
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
  
  const wsClient = useRef<WebSocket | null>(null);
  const dataCallback = useRef<((type: string, data: any) => void) | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const getLocalIP = () => {
    return `${window.location.hostname}:${window.location.port || '3000'}`;
  };

  const startAsServer = () => {
    try {
      setIsServer(true);
      setIsConnected(true);
      setServerUrl(getLocalIP());
      
      // Usar localStorage para sincronização entre abas
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key?.startsWith('festa-sync-')) {
          const type = e.key.replace('festa-sync-', '');
          const data = e.newValue ? JSON.parse(e.newValue) : null;
          if (dataCallback.current && data) {
            console.log('Dados recebidos via localStorage:', type, data);
            dataCallback.current(type, data.data);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      toast({
        title: "🖥️ Servidor iniciado!",
        description: `Outros dispositivos podem se conectar em: ${getLocalIP()}`,
      });

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      toast({
        title: "❌ Erro ao iniciar servidor",
        description: "Verifique as configurações de rede",
        variant: "destructive",
      });
    }
  };

  const connectToServer = (url: string) => {
    if (!url.trim()) return;

    try {
      // Primeiro tentar localStorage sync para teste local
      if (url === getLocalIP() || url === 'localhost' || url.includes('localhost')) {
        setIsConnected(true);
        setServerUrl(url);
        
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key?.startsWith('festa-sync-')) {
            const type = e.key.replace('festa-sync-', '');
            const data = e.newValue ? JSON.parse(e.newValue) : null;
            if (dataCallback.current && data) {
              console.log('Cliente recebeu dados via localStorage:', type, data);
              dataCallback.current(type, data.data);
            }
          }
        };

        window.addEventListener('storage', handleStorageChange);
        
        toast({
          title: "✅ Conectado ao servidor!",
          description: `Sincronizando com ${url}`,
        });
        return;
      }

      // Tentar WebSocket para conexões de rede
      const wsUrl = url.startsWith('ws://') ? url : `ws://${url}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        wsClient.current = ws;
        setIsConnected(true);
        setServerUrl(url);
        
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
        
        toast({
          title: "✅ Conectado ao servidor!",
          description: `Sincronizando com ${url}`,
        });
      };

      ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          if (dataCallback.current) {
            console.log('Cliente recebeu dados via WebSocket:', type, data);
            dataCallback.current(type, data);
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsClient.current = null;
        
        toast({
          title: "⚠️ Conexão perdida",
          description: "Tentando reconectar em 5 segundos...",
          variant: "destructive",
        });

        // Tentar reconectar automaticamente
        reconnectTimeout.current = setTimeout(() => {
          connectToServer(url);
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('Erro WebSocket:', error);
        toast({
          title: "❌ Erro de conexão",
          description: "Verifique o endereço do servidor",
          variant: "destructive",
        });
      };

    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast({
        title: "❌ Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (wsClient.current) {
      wsClient.current.close();
      wsClient.current = null;
    }
    
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    
    setIsServer(false);
    setIsConnected(false);
    setConnectedClients(0);
    setServerUrl('');

    toast({
      title: "🔌 Desconectado",
      description: "Sincronização interrompida",
    });
  };

  const broadcastData = (type: string, data: any) => {
    const message = { type, data, timestamp: new Date().toISOString() };
    console.log('Broadcasting data:', message);
    
    if (isServer || !wsClient.current) {
      // localStorage broadcast (servidor ou fallback)
      const key = `festa-sync-${type}`;
      localStorage.setItem(key, JSON.stringify(message));
      
      // Remover após 2 segundos para não acumular
      setTimeout(() => {
        localStorage.removeItem(key);
      }, 2000);
    } else if (wsClient.current && wsClient.current.readyState === WebSocket.OPEN) {
      // WebSocket para clientes conectados
      wsClient.current.send(JSON.stringify(message));
    }
  };

  const onDataReceived = (callback: (type: string, data: any) => void) => {
    dataCallback.current = callback;
  };

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      if (wsClient.current) {
        wsClient.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

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
