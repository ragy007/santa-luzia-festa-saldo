
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { CheckCircle, AlertCircle, Loader2, Database } from 'lucide-react';

const MigrationStatus: React.FC = () => {
  const { loading, settings, users, booths, products, participants, transactions } = useSupabaseData();

  const hasLocalData = localStorage.getItem('festa-settings') || localStorage.getItem('appState');
  const hasBackup = localStorage.getItem('festa-backup');

  const getMigrationStatus = () => {
    if (loading) return 'loading';
    
    const hasData = settings || users.length > 0 || booths.length > 0 || 
                   products.length > 0 || participants.length > 0 || transactions.length > 0;
    
    if (hasData && !hasLocalData) return 'completed';
    if (hasData && hasLocalData) return 'partial';
    if (!hasData && hasLocalData) return 'pending';
    
    return 'none';
  };

  const status = getMigrationStatus();

  const getStatusInfo = () => {
    switch (status) {
      case 'loading':
        return {
          icon: Loader2,
          text: 'Carregando...',
          color: 'bg-blue-500',
          variant: 'secondary' as const
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Migração Completa',
          color: 'bg-green-500',
          variant: 'default' as const
        };
      case 'partial':
        return {
          icon: AlertCircle,
          text: 'Migração Parcial',
          color: 'bg-yellow-500',
          variant: 'secondary' as const
        };
      case 'pending':
        return {
          icon: AlertCircle,
          text: 'Migração Pendente',
          color: 'bg-orange-500',
          variant: 'destructive' as const
        };
      default:
        return {
          icon: Database,
          text: 'Sem Dados',
          color: 'bg-gray-500',
          variant: 'outline' as const
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Status da Migração
          </span>
          <Badge variant={statusInfo.variant} className="flex items-center">
            <StatusIcon className={`h-4 w-4 mr-1 ${status === 'loading' ? 'animate-spin' : ''}`} />
            {statusInfo.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{settings ? 1 : 0}</div>
            <div className="text-sm text-gray-600">Configurações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{users.length}</div>
            <div className="text-sm text-gray-600">Usuários</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{booths.length}</div>
            <div className="text-sm text-gray-600">Barracas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{products.length}</div>
            <div className="text-sm text-gray-600">Produtos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{participants.length}</div>
            <div className="text-sm text-gray-600">Participantes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{transactions.length}</div>
            <div className="text-sm text-gray-600">Transações</div>
          </div>
        </div>

        {hasLocalData && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Dados locais detectados. Considere executar a migração para sincronizar tudo.
            </p>
          </div>
        )}

        {hasBackup && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              Backup local disponível para restauração se necessário.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MigrationStatus;
