
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../contexts/LocalAppContext';
import { Search, User, CreditCard, Eye, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PrintReceipt from '../components/PrintReceipt';

const ConsultarSaldo: React.FC = () => {
  const { getParticipantByCard, transactions } = useApp();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const handleSearch = () => {
    if (!searchCard) {
      toast({
        title: "Erro",
        description: "Digite o número do cartão para consultar",
        variant: "destructive",
      });
      return;
    }

    const participant = getParticipantByCard(searchCard);
    if (participant) {
      setSelectedParticipant(participant);
      toast({
        title: "Participante encontrado!",
        description: `${participant.name} - Saldo: ${formatCurrency(participant.balance)}`,
      });
    } else {
      setSelectedParticipant(null);
      toast({
        title: "Participante não encontrado",
        description: "Verifique o número do cartão e tente novamente",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const participantTransactions = selectedParticipant 
    ? transactions
        .filter(t => t.participantId === selectedParticipant.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
    : [];

  return (
    <Layout title="Consultar Saldo">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            👁️ Consultar Saldo
          </h1>
          <p className="text-gray-600">
            Consulte o saldo e histórico de qualquer participante
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Consulta */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Buscar Participante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="searchCard">Número do Cartão</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="searchCard"
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
                </div>

                {/* Informações do Participante */}
                {selectedParticipant && (
                  <div className="space-y-4">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <User className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                              <h3 className="text-xl font-bold text-blue-800">
                                {selectedParticipant.name}
                              </h3>
                              <p className="text-blue-600">
                                Cartão: {selectedParticipant.cardNumber}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-blue-600">Saldo Atual</p>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(selectedParticipant.balance)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
                          <div>
                            <p className="text-sm text-blue-600">Saldo Inicial</p>
                            <p className="font-semibold text-blue-800">
                              {formatCurrency(selectedParticipant.initialBalance)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-600">Status</p>
                            <p className="font-semibold text-blue-800">
                              {selectedParticipant.isActive ? 'Ativo' : 'Inativo'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-600">Cadastrado em</p>
                            <p className="font-semibold text-blue-800">
                              {new Date(selectedParticipant.createdAt || '').toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-600">Telefone</p>
                            <p className="font-semibold text-blue-800">
                              {selectedParticipant.phone || 'Não informado'}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <PrintReceipt
                            type="cadastro"
                            data={{
                              participantName: selectedParticipant.name,
                              cardNumber: selectedParticipant.cardNumber,
                              balance: selectedParticipant.balance,
                              operatorName: 'Consulta'
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Histórico de Transações */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <History className="h-5 w-5 mr-2 text-purple-600" />
                          Últimas Transações
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {participantTransactions.map((transaction) => (
                            <div 
                              key={transaction.id} 
                              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                            >
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${
                                  transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {transaction.description}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {formatTime(transaction.timestamp)} • {transaction.operatorName}
                                  </p>
                                  {transaction.booth && (
                                    <p className="text-xs text-gray-400">
                                      Barraca: {transaction.booth}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold ${
                                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'credit' ? '+' : '-'}
                                  {formatCurrency(transaction.amount)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {participantTransactions.length === 0 && (
                            <p className="text-gray-500 text-center py-8">
                              Nenhuma transação encontrada
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instruções */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Eye className="h-5 w-5 mr-2" />
                  Como Consultar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-purple-700">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <span className="text-sm">Digite o número do cartão</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <span className="text-sm">Clique em buscar</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    <span className="text-sm">Veja o saldo e histórico</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                    <span className="text-sm">Imprima se necessário</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800">💡 Dica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 text-sm">
                  Esta funcionalidade é ideal para:
                  <br />• Verificar saldo antes de compras
                  <br />• Consultar histórico de transações
                  <br />• Imprimir comprovante de saldo
                  <br />• Verificar dados do participante
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultarSaldo;
