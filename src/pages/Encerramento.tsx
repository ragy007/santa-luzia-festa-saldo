import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '../contexts/LocalAppContext';
import { CheckCircle, DollarSign, Gift, Heart, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Encerramento: React.FC = () => {
  const { participants, addClosingOption, closingOptions } = useApp();
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [option, setOption] = useState<'refund' | 'gift' | 'donation'>('refund');
  const [amount, setAmount] = useState('');
  const [cardReturned, setCardReturned] = useState(false);
  const [depositRefunded, setDepositRefunded] = useState(false);
  const [notes, setNotes] = useState('');

  const activeParticipants = participants.filter(p => p.isActive && p.balance > 0);
  const processedParticipants = closingOptions.map(co => co.participantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedParticipant || !amount) {
      toast({
        title: "Erro",
        description: "Selecione um participante e informe o valor",
        variant: "destructive",
      });
      return;
    }

    const participant = participants.find(p => p.id === selectedParticipant);
    if (!participant) {
      toast({
        title: "Erro",
        description: "Participante não encontrado",
        variant: "destructive",
      });
      return;
    }

    const closingData = {
      participantId: selectedParticipant,
      option,
      amount: parseFloat(amount),
      cardReturned,
      depositRefunded,
      notes,
      timestamp: new Date().toISOString(),
    };

    addClosingOption(closingData);

    toast({
      title: "Encerramento processado!",
      description: `Participante ${participant.name} processado com sucesso`,
    });

    // Reset form
    setSelectedParticipant('');
    setAmount('');
    setCardReturned(false);
    setDepositRefunded(false);
    setNotes('');
  };

  const getOptionIcon = (opt: string) => {
    switch (opt) {
      case 'refund': return <DollarSign className="h-4 w-4" />;
      case 'gift': return <Gift className="h-4 w-4" />;
      case 'donation': return <Heart className="h-4 w-4" />;
      default: return null;
    }
  };

  const getOptionLabel = (opt: string) => {
    switch (opt) {
      case 'refund': return 'Reembolso';
      case 'gift': return 'Brinde';
      case 'donation': return 'Doação';
      default: return opt;
    }
  };

  return (
    <Layout title="Encerramento da Festa">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Processar Encerramento de Participante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participant">Participante</Label>
                  <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um participante" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeParticipants
                        .filter(p => !processedParticipants.includes(p.id))
                        .map(participant => (
                          <SelectItem key={participant.id} value={participant.id}>
                            {participant.name} - Saldo: R$ {participant.balance.toFixed(2)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="option">Opção de Encerramento</Label>
                  <Select value={option} onValueChange={(value: 'refund' | 'gift' | 'donation') => setOption(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refund">💰 Reembolso em Dinheiro</SelectItem>
                      <SelectItem value="gift">🎁 Conversão em Brinde</SelectItem>
                      <SelectItem value="donation">❤️ Doação para a Festa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cardReturned"
                      checked={cardReturned}
                      onCheckedChange={(checked) => setCardReturned(checked as boolean)}
                    />
                    <Label htmlFor="cardReturned">Cartão devolvido</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="depositRefunded"
                      checked={depositRefunded}
                      onCheckedChange={(checked) => setDepositRefunded(checked as boolean)}
                    />
                    <Label htmlFor="depositRefunded">Caução devolvida</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Processar Encerramento
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participantes Processados ({closingOptions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {closingOptions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Nenhum participante processado ainda
              </p>
            ) : (
              <div className="space-y-3">
                {closingOptions.map((closing, index) => {
                  const participant = participants.find(p => p.id === closing.participantId);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="font-medium">{participant?.name || 'Participante não encontrado'}</span>
                          <p className="text-sm text-gray-500">
                            R$ {closing.amount.toFixed(2)} • {new Date(closing.timestamp).toLocaleString()}
                          </p>
                          {closing.notes && (
                            <p className="text-xs text-gray-400">{closing.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getOptionIcon(closing.option)}
                          {getOptionLabel(closing.option)}
                        </Badge>
                        {closing.cardReturned && (
                          <Badge variant="secondary">Cartão OK</Badge>
                        )}
                        {closing.depositRefunded && (
                          <Badge variant="secondary">Caução OK</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Encerramento;
