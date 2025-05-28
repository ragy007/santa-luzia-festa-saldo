
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../contexts/AppContext';
import { UserPlus, QrCode, CreditCard, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Cadastro: React.FC = () => {
  const { addParticipant, participants, getParticipantByCard } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    initialBalance: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cardNumber) {
      toast({
        title: "Erro",
        description: "Número do cartão é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Verificar se o cartão já existe
    if (getParticipantByCard(formData.cardNumber)) {
      toast({
        title: "Erro", 
        description: "Este número de cartão já está cadastrado",
        variant: "destructive",
      });
      return;
    }

    if (formData.initialBalance < 0) {
      toast({
        title: "Erro",
        description: "Saldo inicial não pode ser negativo",
        variant: "destructive",
      });
      return;
    }

    addParticipant({
      name: formData.name || `Participante ${formData.cardNumber}`,
      cardNumber: formData.cardNumber,
      balance: formData.initialBalance,
      initialBalance: formData.initialBalance,
      isActive: true,
    });

    setFormData({
      name: '',
      cardNumber: '',
      initialBalance: 0,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const generateRandomCardNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    setFormData(prev => ({ ...prev, cardNumber: randomNumber.toString() }));
  };

  return (
    <Layout title="Cadastro de Participantes">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            👥 Cadastro de Participantes
          </h1>
          <p className="text-gray-600">
            Registre novos participantes e seus cartões/pulseiras
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Cadastro */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                  Novo Participante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Participante (opcional)</Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão/Pulseira *</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="cardNumber"
                        placeholder="Digite o número do cartão"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        className="flex-1"
                        required
                      />
                      <Button type="button" variant="outline" onClick={generateRandomCardNumber}>
                        Gerar
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="initialBalance">Saldo Inicial</Label>
                    <Input
                      id="initialBalance"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.initialBalance}
                      onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: parseFloat(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Valor carregado no cartão no momento do cadastro
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar Participante
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* QR Code Info */}
            <Card className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <QrCode className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">QR Code Automático</h3>
                    <p className="text-sm text-green-700">
                      Cada cartão recebe automaticamente um QR Code único para facilitar a leitura
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo e Lista */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Users className="h-5 w-5 mr-2" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total de Participantes:</span>
                    <span className="font-bold text-blue-800">{participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Cartões Ativos:</span>
                    <span className="font-bold text-blue-800">{participants.filter(p => p.isActive).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Saldo Total:</span>
                    <span className="font-bold text-blue-800">
                      {formatCurrency(participants.reduce((total, p) => total + p.balance, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Últimos Cadastros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                  Últimos Cadastros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{participant.name}</p>
                          <p className="text-sm text-gray-500">Cartão: {participant.cardNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(participant.balance)}</p>
                        </div>
                      </div>
                    ))}
                  {participants.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum participante cadastrado ainda
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

export default Cadastro;
