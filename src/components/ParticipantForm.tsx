
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const ParticipantForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    phone: '',
    initialBalance: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addParticipant } = useSupabaseData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Iniciando cadastro...', formData);
      
      if (!formData.cardNumber) {
        toast({
          title: "Erro",
          description: "Número do cartão é obrigatório",
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

      console.log('Salvando via useSupabaseData...');
      
      await addParticipant({
        name: formData.name || `Participante ${formData.cardNumber}`,
        cardNumber: formData.cardNumber,
        phone: formData.phone,
        balance: formData.initialBalance,
        initialBalance: formData.initialBalance,
        isActive: true
      });

      // Limpar formulário após sucesso
      setFormData({
        name: '',
        cardNumber: '',
        phone: '',
        initialBalance: 0,
      });

      toast({
        title: "Sucesso!",
        description: "Participante cadastrado com sucesso",
      });

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast({
        title: "Erro",
        description: `Erro ao cadastrar: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomCardNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    setFormData(prev => ({ ...prev, cardNumber: randomNumber.toString() }));
  };

  return (
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
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone (opcional)</Label>
            <Input
              id="phone"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1"
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={generateRandomCardNumber}
                disabled={isSubmitting}
              >
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
              disabled={isSubmitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              Valor carregado no cartão no momento do cadastro
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={isSubmitting}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Participante'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParticipantForm;
