
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '../contexts/AppContext';
import { AlertTriangle, CheckCircle, DollarSign, Users, CreditCard, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Encerramento: React.FC = () => {
  const { participants, transactions, addClosingOption, getTotalSales, getTotalActiveBalance, getParticipantByCard } = useApp();
  const { profile } = useAuth();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [closingData, setClosingData] = useState({
    option: '',
    cardReturned: false,
    depositRefund: false,
    observations: ''
  });

  const handleSearch = () => {
    if (!searchCard) {
      toast({
        title: "Erro",
        description: "Digite o número do cartão para buscar",
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

  const handleClosing = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive",
      });
      return;
    }

    if (!closingData.option) {
      toast({
        title: "Erro",
        description: "Selecione uma opção de encerramento",
        variant: "destructive",
      });
      return;
    }

    const closingOption = {
      participantId: selectedParticipant.id,
      option: closingData.option as 'refund' | 'gift' | 'donation',
      amount: selectedParticipant.balance,
      cardReturned: closingData.cardReturned,
      depositRefunded: closingData.depositRefund,
      notes: closingData.observations
    };

    addClosingOption(closingOption);

    // Limpar formulário
    setSelectedParticipant(null);
    setSearchCard('');
    setClosingData({
      option: '',
      cardReturned: false,
      depositRefund: false,
      observations: ''
    });

    toast({
      title: "Encerramento registrado!",
      description: `Opção "${closingData.option}" registrada para ${selectedParticipant.name}`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalSales = getTotalSales();
  const totalActiveBalance = getTotalActiveBalance();
  const participantsWithBalance = participants.filter(p => p.balance > 0);

  return (
    <Layout title="Encerramento da Festa">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🏁 Encerramento da Festa
          </h1>
          <p className="text-gray-600">
            Gerencie o encerramento dos cartões e saldos restantes
          </p>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Total de Vendas</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSales)}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="h-6 w-6 text-orange-600 mr-2" />
                <h3 className="font-semibold text-orange-800">Saldo Total em Cartões</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalActiveBalance)}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="font-semibold text-red-800">Cartões com Saldo</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{participantsWithBalance.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Encerramento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Encerramento Individual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Busca de Participante */}
              <div>
                <Label htmlFor="searchCard">Buscar Cartão</Label>
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
                    Buscar
                  </Button>
                  {selectedParticipant && (
                    <Button 
                      onClick={() => {
                        setSelectedParticipant(null);
                        setSearchCard('');
                      }} 
                      variant="outline"
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Informações do Participante */}
              {selectedParticipant && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Participante Selecionado</h3>
                    <div className="space-y-1">
                      <p><span className="font-medium">Nome:</span> {selectedParticipant.name}</p>
                      <p><span className="font-medium">Cartão:</span> {selectedParticipant.cardNumber}</p>
                      <p><span className="font-medium">Saldo Restante:</span> 
                        <span className={`font-bold ml-1 ${selectedParticipant.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {formatCurrency(selectedParticipant.balance)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Formulário de Encerramento */}
              {selectedParticipant && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="option">Opção de Encerramento *</Label>
                    <Select value={closingData.option} onValueChange={(value) => setClosingData(prev => ({ ...prev, option: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="refund">Reembolso em Dinheiro</SelectItem>
                        <SelectItem value="donation">Doação para a Paróquia</SelectItem>
                        <SelectItem value="gift">Crédito para Próximo Evento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="cardReturned"
                        checked={closingData.cardReturned}
                        onChange={(e) => setClosingData(prev => ({ ...prev, cardReturned: e.target.checked }))}
                        className="h-4 w-4 text-blue-600"
                      />
                      <Label htmlFor="cardReturned">Cartão devolvido</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="depositRefund"
                        checked={closingData.depositRefund}
                        onChange={(e) => setClosingData(prev => ({ ...prev, depositRefund: e.target.checked }))}
                        className="h-4 w-4 text-blue-600"
                      />
                      <Label htmlFor="depositRefund">Caução devolvida</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      placeholder="Observações adicionais sobre o encerramento..."
                      value={closingData.observations}
                      onChange={(e) => setClosingData(prev => ({ ...prev, observations: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleClosing} 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    disabled={!closingData.option}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registrar Encerramento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participantes com Saldo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                Cartões com Saldo Pendente ({participantsWithBalance.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {participantsWithBalance.length > 0 ? (
                  participantsWithBalance.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-500">Cartão: {participant.cardNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{formatCurrency(participant.balance)}</p>
                        <Button
                          onClick={() => {
                            setSearchCard(participant.cardNumber);
                            setSelectedParticipant(participant);
                          }}
                          size="sm"
                          variant="outline"
                          className="mt-1"
                        >
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                    <p className="text-lg font-medium">Todos os cartões foram encerrados!</p>
                    <p className="text-sm">Não há saldos pendentes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerta se há saldos pendentes */}
        {participantsWithBalance.length > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Atenção: Saldos Pendentes</h3>
                  <p className="text-yellow-700 text-sm">
                    Ainda existem {participantsWithBalance.length} cartões com saldo não utilizado totalizando {formatCurrency(totalActiveBalance)}. 
                    Certifique-se de processar todos os encerramentos antes de finalizar o evento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Encerramento;
