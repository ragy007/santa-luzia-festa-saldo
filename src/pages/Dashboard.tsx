import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';
import { Users, CreditCard, ShoppingCart, DollarSign, TrendingUp, Clock, Heart, Church } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { participants, transactions, getTotalSales, getTotalActiveBalance, booths } = useApp();
  const { settings } = useSettings();

  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(p => p.isActive).length;
  const totalSales = getTotalSales();
  const totalActiveBalance = getTotalActiveBalance();
  const totalLoaded = participants.reduce((total, p) => total + p.initialBalance, 0) + 
                    transactions.filter(t => t.type === 'credit' && t.description !== 'Carga inicial').reduce((total, t) => total + t.amount, 0);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full">
              <Church className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {settings.title || 'Festa Comunitária 2024'}
          </h1>
          <p className="text-lg text-gray-600">
            {settings.subtitle || 'Centro Social da Paróquia Santa Luzia'}
          </p>
          {settings.religiousMessage && (
            <p className="text-sm text-blue-600 mt-2">
              {settings.religiousMessage}
            </p>
          )}
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <p className="text-xs opacity-80">
                {activeParticipants} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Carregado</CardTitle>
              <CreditCard className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalLoaded)}</div>
              <p className="text-xs opacity-80">
                Em recargas realizadas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendido</CardTitle>
              <ShoppingCart className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              <p className="text-xs opacity-80">
                Em consumos registrados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Ativo</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalActiveBalance)}</div>
              <p className="text-xs opacity-80">
                Disponível nos cartões
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vendas por Barraca e Transações Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas por Barraca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Vendas por Barraca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booths
                  .sort((a, b) => b.totalSales - a.totalSales)
                  .map((booth) => (
                    <div key={booth.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{booth.name}</p>
                        <p className="text-sm text-gray-500">
                          {transactions.filter(t => t.booth === booth.name && t.type === 'debit').length} vendas
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(booth.totalSales)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Transações Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => {
                    const participant = participants.find(p => p.id === transaction.participantId);
                    return (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">
                            {participant?.name || 'Participante não encontrado'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.description} • {formatTime(transaction.timestamp)}
                          </p>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhuma transação registrada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status da Festa */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-800">
                  Status da Festa: ATIVA
                </h3>
                <Church className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-blue-700">
                A festa está acontecendo! Use o menu lateral para gerenciar participantes, 
                registrar vendas e acompanhar os relatórios em tempo real.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
