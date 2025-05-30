import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '../contexts/AppContext';
import { Participant, ClosingOption } from '../types';
import { Search, DollarSign, Gift, Heart, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Encerramento: React.FC = () => {
  const { 
    participants, 
    addClosingOption, 
    updateClosingOption, 
    getClosingOption,
    getTotalActiveBalance 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [closingData, setClosingData] = useState({
    option: 'refund' as 'refund' | 'gift' | 'donation',
    amount: 0,
    cardReturned: false,
    depositRefunded: false,
    notes: ''
  });

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cardNumber.includes(searchTerm)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    
    // Load existing closing option if available
    const existingOption = getClosingOption(participant.id);
    if (existingOption) {
      setClosingData({
        option: existingOption.option,
        amount: existingOption.amount,
        cardReturned: existingOption.cardReturned,
        depositRefunded: existingOption.depositRefunded,
        notes: existingOption.notes || ''
      });
    } else {
      // Reset form if no existing option
      setClosingData({
        option: 'refund',
        amount: 0,
        cardReturned: false,
        depositRefunded: false,
        notes: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setClosingData(prev => ({ ...prev, [id]: checked }));
    } else if (id === 'amount') {
      const parsedValue = parseFloat(value);
      setClosingData(prev => ({ ...prev, amount: isNaN(parsedValue) ? 0 : parsedValue }));
    } else {
      setClosingData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleOptionChange = (value: 'refund' | 'gift' | 'donation') => {
    setClosingData(prev => ({ ...prev, option: value }));
  };

  const handleFinishParticipant = () => {
    if (!selectedParticipant) return;

    const closingOption: ClosingOption = {
      participantId: selectedParticipant.id,
      option: closingData.option,
      amount: closingData.amount,
      cardReturned: closingData.cardReturned,
      depositRefunded: closingData.depositRefunded,
      timestamp: new Date().toISOString(),
      notes: closingData.notes
    };

    addClosingOption(closingOption);
    
    toast({
      title: "✅ Participante encerrado!",
      description: `${selectedParticipant.name} foi processado com sucesso.`,
    });

    // Reset form
    setSelectedParticipant(null);
    setClosingData({
      option: 'refund',
      amount: 0,
      cardReturned: false,
      depositRefunded: false,
      notes: ''
    });
  };

  return (
    <Layout title="Encerramento">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💰 Encerramento
          </h1>
          <p className="text-gray-600">
            Processamento de encerramento de participantes
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              1. Buscar Participante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nome, email ou #cartão..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>

              {filteredParticipants.length > 0 ? (
                <ul className="space-y-2">
                  {filteredParticipants.map(participant => (
                    <li 
                      key={participant.id} 
                      className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${selectedParticipant?.id === participant.id ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
                      onClick={() => handleSelectParticipant(participant)}
                    >
                      <div className="font-medium">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.email} • #{participant.cardNumber}</div>
                      <Badge variant="secondary">Saldo: R$ {participant.balance.toFixed(2)}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">Nenhum participante encontrado.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedParticipant && (
          <Card>
            <CardHeader>
              <CardTitle>
                2. Processar Encerramento de {selectedParticipant.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="font-semibold">
                  Informações do Participante
                </div>
                <div className="text-sm text-gray-500">
                  {selectedParticipant.email} • #{selectedParticipant.cardNumber}
                </div>
                <div className="mt-2">
                  <Badge variant="outline">
                    Saldo Restante: R$ {selectedParticipant.balance.toFixed(2)}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="refund">
                <TabsList>
                  <TabsTrigger value="refund" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Reembolso
                  </TabsTrigger>
                  <TabsTrigger value="gift" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Vale Presente
                  </TabsTrigger>
                  <TabsTrigger value="donation" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Doação
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="refund">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Opções de reembolso para o participante.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Valor a Reembolsar (R$)</Label>
                        <Input
                          type="number"
                          id="amount"
                          value={closingData.amount.toString()}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cardReturned"
                        checked={closingData.cardReturned}
                        onCheckedChange={(checked) => setClosingData(prev => ({ ...prev, cardReturned: checked }))}
                      />
                      <Label htmlFor="cardReturned">Cartão Devolvido</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="depositRefunded"
                        checked={closingData.depositRefunded}
                        onCheckedChange={(checked) => setClosingData(prev => ({ ...prev, depositRefunded: checked }))}
                      />
                      <Label htmlFor="depositRefunded">Caução Devolvida</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gift">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Opções para emitir um vale presente.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Valor do Vale (R$)</Label>
                        <Input
                          type="number"
                          id="amount"
                          value={closingData.amount.toString()}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cardReturned"
                        checked={closingData.cardReturned}
                        onCheckedChange={(checked) => setClosingData(prev => ({ ...prev, cardReturned: checked }))}
                      />
                      <Label htmlFor="cardReturned">Cartão Devolvido</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="donation">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Opções para registrar uma doação.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Valor da Doação (R$)</Label>
                        <Input
                          type="number"
                          id="amount"
                          value={closingData.amount.toString()}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cardReturned"
                        checked={closingData.cardReturned}
                        onCheckedChange={(checked) => setClosingData(prev => ({ ...prev, cardReturned: checked }))}
                      />
                      <Label htmlFor="cardReturned">Cartão Devolvido</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={closingData.notes}
                  onChange={handleInputChange}
                  placeholder="Alguma observação sobre o encerramento..."
                  className="mt-1"
                />
              </div>

              <Button onClick={handleFinishParticipant} className="w-full">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Finalizar Encerramento
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              3. Resumo do Encerramento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="text-lg font-semibold">
                  Saldo Total Ativo: R$ {getTotalActiveBalance().toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Este é o saldo total de todos os participantes ativos.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Encerramento;
