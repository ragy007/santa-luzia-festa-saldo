
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '../contexts/AppContext';
import { History, Search, CreditCard, Calendar, Filter } from 'lucide-react';

const Historico: React.FC = () => {
  const { participants, transactions, getParticipantByCard, getParticipantTransactions } = useApp();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');

  const handleSearch = () => {
    if (!searchCard) return;
    
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

  const getFilteredTransactions = () => {
    if (!selectedParticipant) return [];
    
    const participantTransactions = getParticipantTransactions(selectedParticipant.id);
    
    if (filterType === 'all') return participantTransactions;
    return participantTransactions.filter(t => t.type === filterType);
  };

  const filteredTransactions = getFilteredTransactions();
  const totalCredits = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout title="Histórico de Transações">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📋 Histórico de Transações
          </h1>
          <p className="text-gray-600">
            Consulte o histórico completo de recargas e consumos por participante
          </p>
        </div>

        {/* Busca */}
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
            </div>
          </CardContent>
        </Card>

        {selectedParticipant && (
          <>
            {/* Informações do Participante */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Nome</h3>
                    <p className="text-blue-900">{selectedParticipant.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Cartão</h3>
                    <p className="text-blue-900">{selectedParticipant.cardNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Saldo Atual</h3>
                    <p className="text-blue-900 font-bold">{formatCurrency(selectedParticipant.balance)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Cadastrado em</h3>
                    <p className="text-blue-900">{formatDateTime(selectedParticipant.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-green-800 mb-2">Total Carregado</h3>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-red-800 mb-2">Total Consumido</h3>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-blue-800 mb-2">Saldo Restante</h3>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedParticipant.balance)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-purple-600" />
                  Filtrar Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterType('all')}
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filterType === 'credit' ? 'default' : 'outline'}
                    onClick={() => setFilterType('credit')}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    Recargas
                  </Button>
                  <Button
                    variant={filterType === 'debit' ? 'default' : 'outline'}
                    onClick={() => setFilterType('debit')}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Consumos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Transações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-gray-600" />
                  Histórico de Transações ({filteredTransactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <CreditCard className={`h-4 w-4 text-green-600`} />
                              ) : (
                                <CreditCard className={`h-4 w-4 text-red-600`} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <div className="text-sm text-gray-500 space-y-1">
                                <p className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDateTime(transaction.timestamp)}
                                </p>
                                <p>Operador: {transaction.operatorName}</p>
                                {transaction.booth && <p>Barraca: {transaction.booth}</p>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma transação encontrada</p>
                      <p className="text-sm">
                        {filterType !== 'all' 
                          ? `Nenhuma transação do tipo "${filterType === 'credit' ? 'recarga' : 'consumo'}" encontrada`
                          : 'Este participante ainda não possui transações'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!selectedParticipant && (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Digite o número do cartão para consultar o histórico
              </h3>
              <p className="text-gray-500">
                Você poderá ver todas as recargas e consumos realizados pelo participante
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Historico;
