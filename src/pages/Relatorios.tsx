
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '../contexts/AppContext';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, PieChart } from 'lucide-react';

const Relatorios: React.FC = () => {
  const { participants, transactions, booths, getTotalSales, getTotalActiveBalance } = useApp();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalParticipants = participants.length;
  const totalSales = getTotalSales();
  const totalActiveBalance = getTotalActiveBalance();
  
  // Fix type conversion issues
  const totalLoaded = participants.reduce((total, p) => total + Number(p.initialBalance || 0), 0) + 
                    transactions
                      .filter(t => t.type === 'credit' && t.description !== 'Carga inicial')
                      .reduce((total, t) => total + Number(t.amount || 0), 0);

  // Vendas por barraca
  const salesByBooth = booths.map(booth => ({
    name: booth.name,
    sales: booth.totalSales || 0,
    transactions: transactions.filter(t => t.booth === booth.name && t.type === 'debit').length
  })).sort((a, b) => b.sales - a.sales);

  // Produtos mais vendidos
  const productSales = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, transaction) => {
      const products = transaction.description.split(', ');
      products.forEach(productStr => {
        const match = productStr.match(/(\d+)x (.+)/);
        if (match) {
          const [, quantity, productName] = match;
          const qty = parseInt(quantity);
          acc[productName] = (acc[productName] || 0) + qty;
        }
      });
      return acc;
    }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  // Participantes com maior saldo
  const topBalances = participants
    .sort((a, b) => (b.balance || 0) - (a.balance || 0))
    .slice(0, 10);

  // Vendas por hora (últimas 24h)
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(t => 
    t.type === 'debit' && new Date(t.timestamp).getTime() >= last24h.getTime()
  );

  const salesByHour = Array.from({ length: 24 }, (_, hour) => {
    const hourTransactions = recentTransactions.filter(t => {
      const transactionHour = new Date(t.timestamp).getHours();
      return transactionHour === hour;
    });
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sales: hourTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
      count: hourTransactions.length
    };
  }).filter(h => h.sales > 0);

  return (
    <Layout title="Relatórios Gerenciais">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📊 Relatórios Gerenciais
          </h1>
          <p className="text-gray-600">
            Acompanhe o desempenho da festa em tempo real
          </p>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Participantes</p>
                  <p className="text-2xl font-bold">{totalParticipants}</p>
                </div>
                <Users className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Carregado</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalLoaded).replace('R$ ', 'R$')}</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Vendido</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSales).replace('R$ ', 'R$')}</p>
                </div>
                <BarChart3 className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Saldo Ativo</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalActiveBalance).replace('R$ ', 'R$')}</p>
                </div>
                <DollarSign className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicadores de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-indigo-800 mb-2">Taxa de Conversão</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {totalLoaded > 0 ? Math.round((totalSales / totalLoaded) * 100) : 0}%
              </p>
              <p className="text-sm text-indigo-700">Do valor carregado foi consumido</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-green-800 mb-2">Ticket Médio</h3>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(
                  transactions.filter(t => t.type === 'debit').length > 0 
                    ? totalSales / transactions.filter(t => t.type === 'debit').length 
                    : 0
                )}
              </p>
              <p className="text-sm text-green-700">Por transação de venda</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-amber-800 mb-2">Transações</h3>
              <p className="text-3xl font-bold text-amber-600">
                {transactions.filter(t => t.type === 'debit').length}
              </p>
              <p className="text-sm text-amber-700">Vendas realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Vendas por Barraca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Vendas por Barraca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesByBooth.map((booth, index) => (
                <div key={booth.name} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{booth.name}</span>
                      <span className="font-bold text-lg">{formatCurrency(booth.sales)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{booth.transactions} transações</span>
                      <span>
                        {totalSales > 0 ? Math.round((booth.sales / totalSales) * 100) : 0}% do total
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${totalSales > 0 ? (booth.sales / totalSales) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produtos Mais Vendidos e Participantes com Maior Saldo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-green-600" />
                Produtos Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.length > 0 ? (
                  topProducts.map(([product, quantity], index) => (
                    <div key={product} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{product}</span>
                      </div>
                      <span className="font-bold text-green-600">{quantity} unidades</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma venda registrada ainda</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                Maiores Saldos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topBalances.filter(p => (p.balance || 0) > 0).length > 0 ? (
                  topBalances
                    .filter(p => (p.balance || 0) > 0)
                    .map((participant, index) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            <p className="text-sm text-gray-500">Cartão: {participant.cardNumber}</p>
                          </div>
                        </div>
                        <span className="font-bold text-purple-600">{formatCurrency(participant.balance || 0)}</span>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum saldo ativo encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendas por Horário */}
        {salesByHour.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Vendas por Horário (Últimas 24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {salesByHour.map((hour) => (
                  <div key={hour.hour} className="text-center p-3 border rounded-lg">
                    <p className="font-bold text-lg text-indigo-600">{hour.hour}</p>
                    <p className="text-sm text-gray-900 font-medium">{formatCurrency(hour.sales)}</p>
                    <p className="text-xs text-gray-500">{hour.count} vendas</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Relatorios;
