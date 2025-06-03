
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useBackendSync } from '@/contexts/BackendSyncContext';
import { Server, Wifi, WifiOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const BackendSyncSettings: React.FC = () => {
  const { 
    isConnected, 
    connectionStatus, 
    apiUrl, 
    connect, 
    disconnect 
  } = useBackendSync();
  
  const [inputUrl, setInputUrl] = useState(apiUrl);

  const handleConnect = () => {
    if (inputUrl.trim()) {
      connect(inputUrl.trim());
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'connecting':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <WifiOff className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado ao Backend';
      case 'connecting':
        return 'Conectando...';
      case 'error':
        return 'Erro de Conexão';
      default:
        return 'Desconectado';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'connecting':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 mr-2 text-blue-600" />
          Sincronização com Backend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status atual */}
        <div className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium">{getStatusText()}</p>
              {isConnected && (
                <p className="text-sm opacity-75">
                  Servidor: {apiUrl}
                </p>
              )}
            </div>
          </div>
          
          {isConnected && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          )}
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="server-url">Endereço do Servidor Backend</Label>
              <Input
                id="server-url"
                placeholder="http://localhost:3001"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
                disabled={connectionStatus === 'connecting'}
              />
              <p className="text-sm text-gray-500 mt-1">
                URL do servidor Node.js com Express
              </p>
            </div>
            
            <Button 
              onClick={handleConnect} 
              className="w-full" 
              disabled={connectionStatus === 'connecting' || !inputUrl.trim()}
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Server className="h-4 w-4 mr-2" />
                  Conectar ao Backend
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Backend Conectado
              </h3>
              <p className="text-sm text-green-800 mb-2">
                Sincronização em tempo real ativa!
              </p>
              <p className="text-xs text-green-700">
                Todos os cadastros e vendas serão sincronizados automaticamente entre dispositivos.
              </p>
            </div>

            <Button onClick={disconnect} variant="destructive" className="w-full">
              <WifiOff className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </div>
        )}

        {/* Instruções de setup */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🚀 Como configurar o Backend:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Baixe os arquivos do servidor (pasta 'server')</li>
            <li>2. Execute: <code className="bg-blue-100 px-1 rounded">cd server && npm install</code></li>
            <li>3. Inicie: <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
            <li>4. Conecte usando: <code className="bg-blue-100 px-1 rounded">http://localhost:3001</code></li>
          </ol>
        </div>

        {/* Vantagens */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">✅ Vantagens do Backend:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Sincronização Real:</strong> Dados aparecem instantaneamente</li>
            <li>• <strong>Múltiplos Dispositivos:</strong> Suporte ilimitado</li>
            <li>• <strong>Banco de Dados:</strong> SQLite persistente</li>
            <li>• <strong>WebSocket:</strong> Notificações em tempo real</li>
            <li>• <strong>API REST:</strong> Integração com outros sistemas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendSyncSettings;
