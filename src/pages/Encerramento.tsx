
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '../contexts/AppContext';
import { Settings, Search, DollarSign, Gift, Heart, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Encerramento: React.FC = () => {
  const { participants, getParticipantByCard, addClosingOption, closingOptions } = useApp();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [closingData, setClosingData] = useState({
    option: '',
    cardReturned: false,
    depositRefunded: false,
    notes: ''
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
      
      // Verificar se já foi processado
      const alreadyProcessed = closingOptions.find(c => c.participantId === participant.id);
      if (alreadyProcessed) {
        toast({
          title: "Já processado",
          description: `Este cartão já foi processado em ${new Date(alreadyProcessed.timestamp).toLocaleString('pt-BR')}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Participante encontrado!",
          description: `${participant.name} - Saldo: ${formatCurrency(participant.balance)}`,
        });
      }
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
    if (!selectedParticipant || !closingData.option) {
      toast({
        title: "Erro",
        description: "Selecione um participante e uma opção de encerramento",
        variant: "destructive",
      });
      return;
    }

    // Verificar se já foi processado
    const alreadyProcessed = closingOptions.find(c => c.participantId === selectedParticipant.id);
    if (alreadyProcessed) {
      toast({
        title: "Erro",
        description: "Este cartão já foi processado",
        variant: "destructive",
      });
      return;
    }

    addClosingOption({
      participantId: selectedParticipant.id,
      option: closingData.option as 'refund' | 'gift' | 'donation',
      amount: selectedParticipant.balance,
      cardReturned: closingData.cardReturned,
      depositRefunded: closingData.depositRefunded,
      notes: closingData.notes
    });

    // Limpar formulário
    setSelectedParticipant(null);
    setSearchCard('');
    setClosingData({
      option: '',
      cardReturned: false,
      depositRefunded: false,
      notes: ''
    });
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

  const getOptionLabel = (option: string) => {
    switch (option) {
      case 'refund': return 'Reembolso';
      case 'gift': return 'Brinde';
      case 'donation': return 'Doação';
      default: return option;
    }
  };

  const getOptionIcon = (option: string) => {
    switch (option) {
      case 'refund': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'gift': return <Gift className="h-4 w-4 text-purple-600" />;
      case 'donation': return <Heart className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const totalRefunds = closingOptions.filter(c => c.option === 'refund').reduce((sum, c) => sum + c.amount, 0);
  const totalDonations = closingOptions.filter(c => c.option === 'donation').reduce((sum, c) => sum + c.amount, 0);
  const totalGifts = closingOptions.filter(c => c.option === 'gift').reduce((sum, c) => sum + c.amount, 0);
  const processedCount = closingOptions.length;
  const totalParticipants = participants.length;

  return (
    <Layout title="Encerramento da Festa">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎊 Encerramento da Festa
          </h1>
          <p className="text-gray-600">
            Processe os saldos restantes dos participantes
          </p>
        </div>

        {/* Estatísticas do Encerramento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Processados</h3>
              <p className="text-2xl font-bold text-blue-600">{processedCount}</p>
              <p className="text-sm text-blue-700">de {totalParticipants} participantes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-green-800 mb-2">Reembolsos</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRefunds)}</p>
              <p className="text-sm text-green-700">{closingOptions.filter(c => c.option === 'refund').length} cartões</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-red-800 mb-2">Doações</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDonations)}</p>
              <p className="text-sm text-red-700">{closingOptions.filter(c => c.option === 'donation').length} cartões</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-purple-800 mb-2">Brindes</h3>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalGifts)}</p>
              <p className="text-sm text-purple-700">{closingOptions.filter(c => c.option === 'gift').length} cartões</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário de Encerramento */}
          <div className="space-y-6">
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
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-800 mb-4">Participante Selecionado</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Nome:</span> {selectedParticipant.name}</p>
                      <p><span className="font-medium">Cartão:</span> {selectedParticipant.cardNumber}</p>
                      <p><span className="font-medium">Saldo Restante:</span> <span className="text-green-600 font-bold">{formatCurrency(selectedParticipant.balance)}</span></p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-purple-600" />
                      Opções de Encerramento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="option">O que fazer com o saldo restante? *</Label>
                      <Select value={closingData.option} onValueChange={(value) => setClosingData(prev => ({ ...prev, option: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund">💵 Reembolso total do saldo</SelectItem>
                          <SelectItem value="gift">🎁 Troca por brinde</SelectItem>
                          <SelectItem value="donation">❤️ Doação para a Paróquia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cardReturned"
                          checked={closingData.cardReturned}
                          onCheckedChange={(checked) => setClosingData(prev => ({ ...prev, cardReturned: checked as boolean }))}
                        />
                        <Label htmlFor="cardReturned">Cartão/pulseira foi devolvido</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="depositRefunded"
                          checked={closingData.depositRefunded}
                          onCheckedChange={(checked) => setClosingData(prev => ({ ...prev, depositRefunded: checked as boolean }))}
                        />
                        <Label htmlFor="depositRefunded">Valor da caução foi reembolsado</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Observações (opcional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Adicione observações sobre o encerramento..."
                        value={closingData.notes}
                        onChange={(e) => setClosingData(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleClosing}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      disabled={!closingData.option}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Processar Encerramento
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Lista de Encerramentos Processados */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowLeft className="h-5 w-5 mr-2 text-gray-600" />
                  Encerramentos Processados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {closingOptions.length > 0 ? (
                    closingOptions
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((closing) => {
                        const participant = participants.find(p => p.id === closing.participantId);
                        return (
                          <div key={closing.participantId} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{participant?.name}</h4>
                              <div className="flex items-center space-x-2">
                                {getOptionIcon(closing.option)}
                                <span className="font-bold">{formatCurrency(closing.amount)}</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <p>
                                <span className="font-medium">Opção:</span> {getOptionLabel(closing.option)}
                              </p>
                              <p>
                                <span className="font-medium">Cartão:</span> {participant?.cardNumber}
                              </p>
                              <p>
                                <span className="font-medium">Processado em:</span> {formatDateTime(closing.timestamp)}
                              </p>
                              <div className="flex space-x-4 mt-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  closing.cardReturned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {closing.cardReturned ? 'Cartão devolvido' : 'Cartão não devolvido'}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  closing.depositRefunded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {closing.depositRefunded ? 'Caução reembolsada' : 'Caução não reembolsada'}
                                </span>
                              </div>
                              {closing.notes && (
                                <p className="mt-2">
                                  <span className="font-medium">Obs:</span> {closing.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum encerramento processado ainda</p>
                      <p className="text-sm">Use o formulário ao lado para processar os participantes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumo Final */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-amber-800 mb-4">
                📋 Resumo do Encerramento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRefunds)}</p>
                  <p className="text-green-700">em reembolsos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDonations)}</p>
                  <p className="text-red-700">em doações para a Paróquia</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalGifts)}</p>
                  <p className="text-purple-700">convertidos em brindes</p>
                </div>
              </div>
              <p className="text-amber-700 mt-4">
                {processedCount} de {totalParticipants} participantes processados
                {processedCount === totalParticipants && " ✅ Todos processados!"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Encerramento;
