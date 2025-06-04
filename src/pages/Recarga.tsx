import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../contexts/LocalAppContext';
import { useAuth } from '@/contexts/LocalAuthContext';
import { CreditCard, Search, Plus, DollarSign, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PrintReceipt from '../components/PrintReceipt';

const Recarga: React.FC = () => {
  const { addTransaction, getParticipantByCard, participants, transactions } = useApp();
  const { user } = useAuth();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [lastRecharge, setLastRecharge] = useState<any>(null);

  // Usar o nome do usuário logado automaticamente
  const operatorName = user?.name || 'Sistema';

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
        description: `${participant.name} - Saldo atual: ${formatCurrency(participant.balance)}`,
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

  const handleRecharge = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive",
      });
      return;
    }

    if (rechargeAmount <= 0) {
      toast({
        title: "Erro",
        description: "Valor da recarga deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const previousBalance = selectedParticipant.balance;

    addTransaction({
      participantId: selectedParticipant.id,
      type: 'credit',
      amount: rechargeAmount,
      description: 'Recarga via maquininha',
      operatorName: operatorName,
    });

    // Salvar dados para impressão
    setLastRecharge({
      participantName: selectedParticipant.name,
      cardNumber: selectedParticipant.cardNumber,
      amount: rechargeAmount,
      balance: previousBalance + rechargeAmount,
      operatorName: operatorName
    });

    toast({
      title: "Recarga realizada!",
      description: `${formatCurrency(rechargeAmount)} adicionado ao cartão de ${selectedParticipant.name}`,
    });

    // Limpar formulário
    setRechargeAmount(0);
    setSearchCard('');
    setSelectedParticipant(null);
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

  const recentRecharges = transactions
    .filter(t => t.type === 'credit' && t.description !== 'Carga inicial')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const totalRecharges = transactions
    .filter(t => t.type === 'credit' && t.description !== 'Carga inicial')
    .reduce((total, t) => total + t.amount, 0);

  return (
    <Layout title="Recarga de Créditos">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💳 Recarga de Créditos
          </h1>
          <p className="text-gray-600">
            Adicione saldo aos cartões dos participantes
          </p>
          <p className="text-sm text-blue-600 font-medium mt-1">
            Operador: {operatorName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Recarga */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Nova Recarga
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
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Informações do Participante */}
                {selectedParticipant && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Participante Selecionado</h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Nome:</span> {selectedParticipant.name}</p>
                        <p><span className="font-medium">Cartão:</span> {selectedParticipant.cardNumber}</p>
                        <p><span className="font-medium">Saldo Atual:</span> <span className="text-green-600 font-bold">{formatCurrency(selectedParticipant.balance)}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Formulário de Recarga */}
                {selectedParticipant && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rechargeAmount">Valor da Recarga *</Label>
                      <Input
                        id="rechargeAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || 0)}
                        className="mt-1"
                        required
                      />
                    </div>

                    {/* Botões de Valores Rápidos */}
                    <div className="space-y-2">
                      <Label>Valores Rápidos</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[10, 20, 50, 100, 200, 500].map((value) => (
                          <Button
                            key={value}
                            variant="outline"
                            onClick={() => setRechargeAmount(value)}
                            className="text-sm"
                          >
                            R$ {value}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleRecharge} 
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        disabled={!rechargeAmount}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Realizar Recarga de {formatCurrency(rechargeAmount)}
                      </Button>
                      
                      {lastRecharge && (
                        <PrintReceipt
                          type="recarga"
                          data={lastRecharge}
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo e Histórico */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Resumo de Recargas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total em Recargas:</span>
                    <span className="font-bold text-green-800">{formatCurrency(totalRecharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Recargas Hoje:</span>
                    <span className="font-bold text-green-800">
                      {recentRecharges.filter(r => 
                        new Date(r.timestamp).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recargas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-purple-600" />
                  Recargas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRecharges.map((recharge) => {
                    const participant = participants.find(p => p.id === recharge.participantId);
                    return (
                      <div key={recharge.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{participant?.name}</p>
                          <p className="text-sm text-gray-500">
                            {recharge.operatorName} • {formatTime(recharge.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{formatCurrency(recharge.amount)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {recentRecharges.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma recarga registrada ainda
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recarga;
