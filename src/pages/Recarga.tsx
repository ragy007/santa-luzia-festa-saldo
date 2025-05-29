
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../contexts/AppContext';
import { CreditCard, Search, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Recarga: React.FC = () => {
  const { participants, addTransaction, getParticipantByCard } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearchParticipant = () => {
    if (!cardNumber.trim()) {
      toast({
        title: "Erro!",
        description: "Digite o número do cartão.",
        variant: "destructive",
      });
      return;
    }

    const participant = getParticipantByCard(cardNumber);
    if (participant) {
      setSelectedParticipant(participant);
    } else {
      toast({
        title: "Participante não encontrado!",
        description: "Verifique o número do cartão e tente novamente.",
        variant: "destructive",
      });
      setSelectedParticipant(null);
    }
  };

  const handleRecharge = async () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro!",
        description: "Selecione um participante primeiro.",
        variant: "destructive",
      });
      return;
    }

    const rechargeAmount = parseFloat(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      toast({
        title: "Erro!",
        description: "Digite um valor válido para a recarga.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      addTransaction({
        participantId: selectedParticipant.id,
        type: 'credit',
        amount: rechargeAmount,
        description: `Recarga de ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(rechargeAmount)}`,
        operatorName: 'Administrador',
      });

      toast({
        title: "Recarga realizada!",
        description: `Recarga de ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(rechargeAmount)} adicionada ao cartão.`,
      });

      // Reset form
      setCardNumber('');
      setAmount('');
      setSelectedParticipant(null);
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Erro ao processar a recarga.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Layout title="Recarga de Cartões">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💳 Recarga de Cartões
          </h1>
          <p className="text-gray-600">
            Adicione saldo aos cartões dos participantes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buscar Participante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-600" />
                Buscar Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <div className="flex space-x-2">
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Digite o número do cartão"
                    className="flex-1"
                  />
                  <Button onClick={handleSearchParticipant} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedParticipant && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">
                    Participante Encontrado
                  </h3>
                  <p className="text-green-700">
                    <strong>Nome:</strong> {selectedParticipant.name}
                  </p>
                  <p className="text-green-700">
                    <strong>Cartão:</strong> {selectedParticipant.cardNumber}
                  </p>
                  <p className="text-green-700">
                    <strong>Saldo Atual:</strong> {formatCurrency(selectedParticipant.balance)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Realizar Recarga */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-green-600" />
                Adicionar Recarga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Valor da Recarga</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  disabled={!selectedParticipant}
                />
              </div>

              <Button
                onClick={handleRecharge}
                disabled={!selectedParticipant || !amount || loading}
                className="w-full"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading ? 'Processando...' : 'Realizar Recarga'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Participantes */}
        <Card>
          <CardHeader>
            <CardTitle>Participantes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Nome</th>
                    <th className="text-left p-2">Cartão</th>
                    <th className="text-left p-2">Saldo Atual</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length > 0 ? (
                    participants.map((participant) => (
                      <tr key={participant.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{participant.name}</td>
                        <td className="p-2">{participant.cardNumber}</td>
                        <td className="p-2">{formatCurrency(participant.balance)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            participant.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {participant.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500">
                        Nenhum participante cadastrado ainda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Recarga;
