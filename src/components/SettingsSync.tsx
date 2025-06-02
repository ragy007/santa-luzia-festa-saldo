
import React from 'react';
import LocalSyncSettings from './LocalSyncSettings';

const SettingsSync: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔄 Sincronização Local
        </h2>
        <p className="text-gray-600">
          Configure a sincronização em tempo real entre dispositivos na sua rede
        </p>
      </div>

      <LocalSyncSettings />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">✅ Vantagens da Sincronização Local:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• <strong>Tempo Real:</strong> Cadastros e recargas aparecem instantaneamente</li>
          <li>• <strong>Offline:</strong> Funciona sem internet, apenas WiFi local</li>
          <li>• <strong>Simples:</strong> Configuração em poucos cliques</li>
          <li>• <strong>Múltiplos Operadores:</strong> Várias barracas podem trabalhar simultaneamente</li>
          <li>• <strong>Backup:</strong> Dados ficam salvos em todos os dispositivos</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📱 Cenário de Uso Típico:</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>1. Admin (Computador/Tablet principal):</strong></p>
          <p className="ml-4">• Clica em "Iniciar como Servidor"</p>
          <p className="ml-4">• Faz cadastros e recargas</p>
          
          <p><strong>2. Barraca 1 (Tablet/Celular):</strong></p>
          <p className="ml-4">• Conecta ao servidor do admin</p>
          <p className="ml-4">• Vê todos os participantes em tempo real</p>
          <p className="ml-4">• Registra vendas que aparecem no relatório do admin</p>
          
          <p><strong>3. Barraca 2, 3, etc:</strong></p>
          <p className="ml-4">• Mesmo processo da Barraca 1</p>
          <p className="ml-4">• Todos sincronizados automaticamente</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSync;
