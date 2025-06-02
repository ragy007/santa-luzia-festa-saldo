
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSync } from '@/contexts/LocalSyncContext';
import { Wifi, WifiOff, Server, Smartphone, Users, Globe, Monitor } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LocalSyncSettings: React.FC = () => {
  const { 
    isServer, 
    isConnected, 
    connectedClients, 
    serverUrl, 
    startAsServer, 
    connectToServer, 
    disconnect 
  } = useSync();
  
  const [inputUrl, setInputUrl] = useState('');

  const handleStartServer = () => {
    startAsServer();
  };

  const handleConnect = () => {
    if (!inputUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Digite o endereço do servidor para conectar",
        variant: "destructive",
      });
      return;
    }
    connectToServer(inputUrl.trim());
  };

  const getLocalIP = () => {
    // Simular IP local - em produção seria obtido do servidor
    return `192.168.1.100:3001`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wifi className="h-5 w-5 mr-2 text-blue-600" />
          Sincronização em Rede Local
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status atual */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </p>
              <p className="text-sm text-gray-600">
                {isServer ? 'Funcionando como servidor' : 'Cliente'}
              </p>
            </div>
          </div>
          
          {isConnected && (
            <div className="text-right">
              {isServer && (
                <Badge variant="secondary" className="mb-1">
                  <Users className="h-3 w-3 mr-1" />
                  {connectedClients} dispositivos
                </Badge>
              )}
              <p className="text-xs text-gray-500">{serverUrl}</p>
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            {/* Opção 1: Ser servidor */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Server className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="font-medium">Opção 1: Ser o Servidor Principal</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Use esta opção no dispositivo principal (geralmente do administrador). 
                Outros dispositivos irão se conectar a este.
              </p>
              <Button onClick={handleStartServer} className="w-full">
                <Monitor className="h-4 w-4 mr-2" />
                Iniciar como Servidor
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                💡 Outros dispositivos poderão se conectar em: {getLocalIP()}
              </p>
            </div>

            {/* Opção 2: Conectar a servidor */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="font-medium">Opção 2: Conectar a um Servidor</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Use esta opção nos dispositivos das barracas/operadores. 
                Digite o endereço mostrado no servidor principal.
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="server-url">Endereço do Servidor</Label>
                  <Input
                    id="server-url"
                    placeholder="Ex: 192.168.1.100:3001"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleConnect} className="w-full" variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Conectar ao Servidor
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isServer && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">📡 Servidor Ativo</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Outros dispositivos podem se conectar usando:
                </p>
                <code className="bg-blue-100 px-2 py-1 rounded text-sm">
                  {serverUrl}
                </code>
              </div>
            )}

            <Button onClick={disconnect} variant="destructive" className="w-full">
              <WifiOff className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">🔧 Como usar:</h4>
          <ol className="text-sm text-yellow-800 space-y-1">
            <li>1. <strong>Admin:</strong> Use "Iniciar como Servidor" no dispositivo principal</li>
            <li>2. <strong>Operadores:</strong> Use "Conectar ao Servidor" nos outros dispositivos</li>
            <li>3. <strong>Automático:</strong> Cadastros e recargas aparecerão em tempo real em todos os dispositivos</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalSyncSettings;
