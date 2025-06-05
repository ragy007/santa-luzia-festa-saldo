
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../contexts/LocalAppContext';
import { useAuth } from '@/contexts/LocalAuthContext';
import { UserPlus, DollarSign, Phone, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PrintReceipt from './PrintReceipt';
import BarcodeScanner from './BarcodeScanner';

const ParticipantForm: React.FC = () => {
  const { addParticipant } = useApp();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    phone: '',
    initialBalance: 0,
  });
  const [lastRegistered, setLastRegistered] = useState<any>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const handleBarcodeScan = (barcode: string) => {
    setFormData(prev => ({ ...prev, cardNumber: barcode }));
    setShowBarcodeScanner(false);
    toast({
      title: "Código capturado!",
      description: `Cartão: ${barcode}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cardNumber) {
      toast({
        title: "Erro",
        description: "Nome e número do cartão são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (formData.initialBalance < 0) {
      toast({
        title: "Erro",
        description: "O valor inicial não pode ser negativo",
        variant: "destructive",
      });
      return;
    }

    try {
      const newParticipant = addParticipant({
        name: formData.name,
        cardNumber: formData.cardNumber,
        phone: formData.phone,
        initialBalance: formData.initialBalance,
        balance: formData.initialBalance,
        isActive: true
      });

      // Salvar dados para impressão
      setLastRegistered({
        participantName: formData.name,
        cardNumber: formData.cardNumber,
        balance: formData.initialBalance,
        operatorName: user?.name || 'Sistema'
      });

      toast({
        title: "Participante cadastrado!",
        description: `${formData.name} foi cadastrado com sucesso.`,
      });

      // Limpar formulário
      setFormData({
        name: '',
        cardNumber: '',
        phone: '',
        initialBalance: 0,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
            Novo Participante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Número do Cartão/Pulseira *</Label>
                <div className="flex gap-2">
                  <Input
                    id="cardNumber"
                    placeholder="Ex: 001, 002, 003..."
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="mt-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBarcodeScanner(true)}
                    className="mt-1"
                  >
                    📄 Scanner
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone (Opcional)</Label>
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="initialBalance">Valor Inicial *</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Botões de Valores Rápidos */}
            <div className="space-y-2">
              <Label>Valores Rápidos</Label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50, 100, 200, 500].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, initialBalance: value }))}
                    className="text-sm"
                  >
                    R$ {value}
                  </Button>
                ))}
              </div>
            </div>

            {/* Resumo */}
            {formData.name && formData.cardNumber && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Resumo do Cadastro</h3>
                  <div className="space-y-1 text-green-700">
                    <p><span className="font-medium">Nome:</span> {formData.name}</p>
                    <p><span className="font-medium">Cartão:</span> {formData.cardNumber}</p>
                    <p><span className="font-medium">Telefone:</span> {formData.phone || 'Não informado'}</p>
                    <p><span className="font-medium">Valor Inicial:</span> {formatCurrency(formData.initialBalance)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar Participante
              </Button>
              
              {lastRegistered && (
                <PrintReceipt
                  type="cadastro"
                  data={lastRegistered}
                />
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Scanner Código de Barras */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onScan={handleBarcodeScan}
        onClose={() => setShowBarcodeScanner(false)}
      />
    </>
  );
};

export default ParticipantForm;
