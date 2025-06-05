
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, DollarSign, Receipt } from 'lucide-react';
import QRCodeScanner from '../components/QRCodeScanner';
import BarcodeScanner from '../components/BarcodeScanner';
import { useApp } from '../contexts/LocalAppContext';
import { useAuth } from '../contexts/LocalAuthContext';
import { toast } from '@/hooks/use-toast';
import PrintReceipt from '../components/PrintReceipt';

const Recarga: React.FC = () => {
  const { user } = useAuth();
  const { addTransaction, getParticipantByCard, updateParticipant } = useApp();
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState<number>(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const handleParticipantSearch = () => {
    if (!cardNumber.trim()) {
      toast({
        title: "Erro",
        description: "Digite o número do cartão",
        variant: "destructive"
      });
      return;
    }

    const participant = getParticipantByCard(cardNumber.trim());
    
    if (!participant) {
      toast({
        title: "Participante não encontrado",
        description: "Verifique o número do cartão",
        variant: "destructive"
      });
      return;
    }

    if (!participant.isActive) {
      toast({
        title: "Cartão inativo",
        description: "Este cartão foi desativado",
        variant: "destructive"
      });
      return;
    }

    setSelectedParticipant(participant);
    toast({
      title: "Participante encontrado!",
      description: `${participant.name} - Saldo: R$ ${participant.balance.toFixed(2)}`
    });
  };

  const handleQRCodeScan = (data: string) => {
    setCardNumber(data);
    setShowScanner(false);
    setTimeout(() => {
      handleParticipantSearch();
    }, 100);
  };

  const handleBarcodeScan = (barcode: string) => {
    setCardNumber(barcode);
    setShowBarcodeScanner(false);
    setTimeout(() => {
      handleParticipantSearch();
    }, 100);
  };

  const handleRecharge = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive"
      });
      return;
    }

    if (rechargeAmount <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido para recarga",
        variant: "destructive"
      });
      return;
    }

    // Registrar transação
    const transaction = {
      participantId: selectedParticipant.id,
      type: 'credit' as const,
      amount: rechargeAmount,
      description: `Recarga de R$ ${rechargeAmount.toFixed(2)}`,
      booth: user?.boothName || 'Sistema',
      operatorName: user?.name || 'Operador'
    };

    addTransaction(transaction);

    // Atualizar saldo do participante
    const newBalance = selectedParticipant.balance + rechargeAmount;
    updateParticipant(selectedParticipant.id, {
      balance: newBalance
    });

    // Preparar dados para o recibo
    setLastTransaction({
      participantName: selectedParticipant.name,
      cardNumber: selectedParticipant.cardNumber,
      amount: rechargeAmount,
      balance: newBalance,
      operatorName: user?.name || 'Sistema'
    });

    toast({
      title: "Recarga realizada!",
      description: `Adicionado R$ ${rechargeAmount.toFixed(2)} ao cartão`,
    });

    // Limpar formulário
    setSelectedParticipant(null);
    setCardNumber('');
    setRechargeAmount(0);
    setShowReceipt(true);
  };

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  const clearForm = () => {
    setSelectedParticipant(null);
    setCardNumber('');
    setRechargeAmount(0);
  };

  return (
    <Layout title="Recarga">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💰 Recarga de Cartão
          </h1>
          <p className="text-gray-600">
            Adicione créditos aos cartões dos participantes
          </p>
        </div>

        {/* Buscar Participante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Identificar Participante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="card-number">Número do Cartão</Label>
                <Input
                  id="card-number"
                  placeholder="Digite o número do cartão"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleParticipantSearch()}
                />
              </div>
              <div className="flex gap-2 items-end">
                <Button onClick={handleParticipantSearch}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" onClick={() => setShowScanner(true)}>
                  📱 QR Code
                </Button>
                <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
                  📄 Código de Barras
                </Button>
                {selectedParticipant && (
                  <Button variant="outline" onClick={clearForm}>
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {selectedParticipant && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800">{selectedParticipant.name}</h3>
                    <p className="text-green-600">Cartão: {selectedParticipant.cardNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Saldo Atual</p>
                    <p className="text-xl font-bold text-green-800">
                      R$ {selectedParticipant.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recarga */}
        {selectedParticipant && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Adicionar Créditos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="recharge-amount">Valor da Recarga</Label>
                <Input
                  id="recharge-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  value={rechargeAmount || ''}
                  onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              </div>

              {/* Valores Rápidos */}
              <div className="space-y-2">
                <Label>Valores Rápidos</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      onClick={() => setRechargeAmount(value)}
                      className="text-sm"
                    >
                      R$ {value}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              {rechargeAmount > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Resumo da Recarga</h3>
                    <div className="space-y-1 text-blue-700">
                      <p><span className="font-medium">Participante:</span> {selectedParticipant.name}</p>
                      <p><span className="font-medium">Saldo Atual:</span> R$ {selectedParticipant.balance.toFixed(2)}</p>
                      <p><span className="font-medium">Valor da Recarga:</span> R$ {rechargeAmount.toFixed(2)}</p>
                      <p><span className="font-medium">Novo Saldo:</span> R$ {(selectedParticipant.balance + rechargeAmount).toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                onClick={handleRecharge}
                className="w-full"
                size="lg"
                disabled={rechargeAmount <= 0}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Confirmar Recarga - R$ {rechargeAmount.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recibo */}
        {showReceipt && lastTransaction && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Recarga Realizada com Sucesso!
              </CardTitle>
              <Button 
                variant="outline"
                onClick={() => setShowReceipt(false)}
              >
                Fechar
              </Button>
            </CardHeader>
            <CardContent>
              <PrintReceipt 
                type="recarga"
                data={lastTransaction}
              />
            </CardContent>
          </Card>
        )}

        {/* Scanner QR Code */}
        <QRCodeScanner
          isOpen={showScanner}
          onScan={handleQRCodeScan}
          onClose={() => setShowScanner(false)}
        />

        {/* Scanner Código de Barras */}
        <BarcodeScanner
          isOpen={showBarcodeScanner}
          onScan={handleBarcodeScan}
          onClose={() => setShowBarcodeScanner(false)}
        />
      </div>
    </Layout>
  );
};

export default Recarga;
