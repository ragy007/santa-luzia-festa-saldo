
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useApp } from '../contexts/LocalAppContext';
import { History, Search, CreditCard, Calendar, Filter, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';

const Historico: React.FC = () => {
  const { participants, transactions, getParticipantByCard } = useApp();
  const [searchCard, setSearchCard] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const handleSearch = () => {
    if (!searchCard) {
      setSelectedParticipant(null);
      return;
    }
    
    const participant = getParticipantByCard(searchCard);
    setSelectedParticipant(participant);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const filterTransactionsByPeriod = (transactions: Transaction[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (filterPeriod) {
      case 'today':
        return transactions.filter(t => new Date(t.timestamp) >= today);
      case 'week':
        return transactions.filter(t => new Date(t.timestamp) >= weekAgo);
      case 'month':
        return transactions.filter(t => new Date(t.timestamp) >= monthAgo);
      default:
        return transactions;
    }
  };

  const getFilteredTransactions = () => {
    let filteredTransactions = selectedParticipant 
      ? transactions.filter(t => t.participantId === selectedParticipant.id)
      : transactions;

    // Filtrar por tipo
    if (filterType !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
    }

    // Filtrar por período
    filteredTransactions = filterTransactionsByPeriod(filteredTransactions);

    return filteredTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const filteredTransactions = getFilteredTransactions();
  const totalCredits = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  const exportTransactions = () => {
    const csvContent = [
      ['Data/Hora', 'Participante', 'Cartão', 'Tipo', 'Valor', 'Descrição', 'Barraca', 'Operador'].join(','),
      ...filteredTransactions.map(transaction => {
        const participant = participants.find(p => p.id === transaction.participantId);
        return [
          formatDateTime(transaction.timestamp),
          participant?.name || 'N/A',
          participant?.cardNumber || 'N/A',
          transaction.type === 'credit' ? 'Crédito' : 'Débito',
          formatCurrency(transaction.amount),
          transaction.description,
          transaction.booth || 'N/A',
          transaction.operatorName
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico_transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Layout title="Histórico de Transações">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📋 Histórico de Transações
          </h1>
          <p className="text-gray-600">
            Consulte o histórico completo de todas as transações da festa
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Busca por Participante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-600" />
                Buscar Participante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o número do cartão"
                  value={searchCard}
                  onChange={(e) => setSearchCard(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                {selectedParticipant && (
                  <Button 
                    onClick={() => {
                      setSelectedParticipant(null);
                      setSearchCard('');
                    }} 
                    variant="outline"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              {selectedParticipant && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">{selectedParticipant.name}</p>
                  <p className="text-sm text-blue-600">Cartão: {selectedParticipant.cardNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-purple-600" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo de Transação</label>
                <Select value={filterType} onValueChange={(value: 'all' | 'credit' | 'debit') => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="credit">Créditos</SelectItem>
                    <SelectItem value="debit">Débitos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Período</label>
                <Select value={filterPeriod} onValueChange={(value: 'today' | 'week' | 'month' | 'all') => setFilterPeriod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-800">Total Créditos</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
              <p className="text-sm text-green-600">
                {filteredTransactions.filter(t => t.type === 'credit').length} transações
              </p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-800">Total Débitos</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
              <p className="text-sm text-red-600">
                {filteredTransactions.filter(t => t.type === 'debit').length} transações
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <History className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Total Transações</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{filteredTransactions.length}</p>
              <p className="text-sm text-blue-600">
                Saldo líquido: {formatCurrency(totalCredits - totalDebits)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Transações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-gray-600" />
                Transações ({filteredTransactions.length})
              </CardTitle>
              <Button onClick={exportTransactions} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Participante</TableHead>
                      <TableHead>Cartão</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Barraca</TableHead>
                      <TableHead>Operador</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
                      const participant = participants.find(p => p.id === transaction.participantId);
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              {formatDateTime(transaction.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {participant?.name || 'N/A'}
                          </TableCell>
                          <TableCell className="font-mono">
                            <div className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1 text-gray-400" />
                              {participant?.cardNumber || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {transaction.type === 'credit' ? 'Crédito' : 'Débito'}
                            </span>
                          </TableCell>
                          <TableCell className={`font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.booth || '-'}</TableCell>
                          <TableCell className="text-gray-600">{transaction.operatorName}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhuma transação encontrada</p>
                <p className="text-sm">
                  Ajuste os filtros ou período para ver mais resultados
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Historico;
