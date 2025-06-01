
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataMigration } from '@/hooks/useDataMigration';
import { Database, Upload, Download, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DataMigrationPanel: React.FC = () => {
  const { migrateFromLocalStorage, restoreFromBackup } = useDataMigration();
  const [migrating, setMigrating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleMigration = async () => {
    setMigrating(true);
    try {
      await migrateFromLocalStorage();
    } finally {
      setMigrating(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restoreFromBackup();
    } finally {
      setRestoring(false);
    }
  };

  // Verificar se há dados para migrar
  const hasLocalData = localStorage.getItem('festa-settings') || localStorage.getItem('appState');
  const hasBackup = localStorage.getItem('festa-backup');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Migração de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Esta seção permite migrar dados do localStorage para o banco de dados Supabase 
            e habilitar sincronização em tempo real entre dispositivos.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Migrar para Banco de Dados</h4>
              <p className="text-sm text-gray-500">
                {hasLocalData 
                  ? "Dados encontrados no localStorage" 
                  : "Nenhum dado local encontrado"
                }
              </p>
            </div>
            <Button
              onClick={handleMigration}
              disabled={!hasLocalData || migrating}
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {migrating ? 'Migrando...' : 'Migrar'}
            </Button>
          </div>

          {hasBackup && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Restaurar Backup</h4>
                <p className="text-sm text-gray-500">
                  Restaurar dados do backup local
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleRestore}
                disabled={restoring}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {restoring ? 'Restaurando...' : 'Restaurar'}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Benefícios da Migração:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Sincronização em tempo real entre dispositivos</li>
            <li>• Backup automático na nuvem</li>
            <li>• Melhor performance e confiabilidade</li>
            <li>• Acesso aos dados de qualquer lugar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataMigrationPanel;
