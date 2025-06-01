
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFestivalSettings } from '@/hooks/useFestivalSettings';
import { useUserAccounts } from '@/hooks/useUserAccounts';
import { useFestivalBooths } from '@/hooks/useFestivalBooths';
import { useFestivalProducts } from '@/hooks/useFestivalProducts';
import { useParticipants } from '@/hooks/useParticipants';
import { useTransactions } from '@/hooks/useTransactions';
import { Database, Users, ShoppingBag, Store, UserCheck, Receipt } from 'lucide-react';
import DataMigrationPanel from './DataMigrationPanel';

const SettingsDatabase: React.FC = () => {
  const { settings, loading: settingsLoading } = useFestivalSettings();
  const { users, loading: usersLoading } = useUserAccounts();
  const { booths, loading: boothsLoading } = useFestivalBooths();
  const { products, loading: productsLoading } = useFestivalProducts();
  const { participants, loading: participantsLoading } = useParticipants();
  const { transactions, loading: transactionsLoading } = useTransactions();

  const stats = [
    {
      title: 'Configurações',
      count: settings ? 1 : 0,
      icon: Database,
      loading: settingsLoading,
      color: 'bg-blue-500'
    },
    {
      title: 'Usuários',
      count: users.length,
      icon: Users,
      loading: usersLoading,
      color: 'bg-green-500'
    },
    {
      title: 'Barracas',
      count: booths.length,
      icon: Store,
      loading: boothsLoading,
      color: 'bg-purple-500'
    },
    {
      title: 'Produtos',
      count: products.length,
      icon: ShoppingBag,
      loading: productsLoading,
      color: 'bg-orange-500'
    },
    {
      title: 'Participantes',
      count: participants.length,
      icon: UserCheck,
      loading: participantsLoading,
      color: 'bg-indigo-500'
    },
    {
      title: 'Transações',
      count: transactions.length,
      icon: Receipt,
      loading: transactionsLoading,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <DataMigrationPanel />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Status do Banco de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-5 w-5 text-white p-1 rounded ${stat.color}`} />
                    {stat.loading ? (
                      <Badge variant="secondary">Carregando...</Badge>
                    ) : (
                      <Badge variant="default">{stat.count}</Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-sm">{stat.title}</h3>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">
              Sincronização em Tempo Real Ativa
            </h4>
            <p className="text-sm text-green-800">
              Todas as alterações são sincronizadas automaticamente entre dispositivos.
              Os dados são atualizados em tempo real conforme outros usuários fazem modificações.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsDatabase;
