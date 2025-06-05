
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Search, Eye } from 'lucide-react';
import QRCodeScanner from '../components/QRCodeScanner';
import BarcodeScanner from '../components/BarcodeScanner';
import { useApp } from '../contexts/LocalAppContext';
import { toast } from '@/hooks/use-toast';

const ConsultaSaldo: React.FC = () => {
  const { getParticipantByCard, transactions } = useApp();
  const [cardNumber, setCardNumber] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

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

  const getParticipantTransactions = () => {
    if (!selectedParticipant) return [];
    return transactions
      .filter(t => t.participantId === selectedParticipant.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10); // Últimas 10 transações
  };

  const clearSearch = () => {
    setCardNumber('');
    setSelectedParticipant(null);
  };

  return (
    <Layout title="Consulta de Saldo">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            👁️ Consulta de Saldo
          </h1>
          <p className="text-gray-600">
            Consulte o saldo e histórico de transações dos participantes
          </p>
        </div>

        {/* Buscar Participante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Participante
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
                  <Eye className="h-4 w-4 mr-2" />
                  Consultar
                </Button>
                <Button variant="outline" onClick={() => setShowScanner(true)}>
                  📱 QR Code
                </Button>
                <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
                  📄 Código de Barras
                </Button>
                {selectedParticipant && (
                  <Button variant="outline" onClick={clearSearch}>
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Participante */}
        {selectedParticipant && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Participante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-lg font-semibold">{selectedParticipant.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cartão</label>
                    <p className="text-lg">{selectedParticipant.cardNumber}</p>
                  </div>
                  {selectedParticipant.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefone</label>
                      <p className="text-lg">{selectedParticipant.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div>
                      <Badge variant={selectedParticipant.isActive ? "default" : "destructive"}>
                        {selectedParticipant.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-600 mb-1">Saldo Atual</p>
                    <p className="text-3xl font-bold text-blue-800">
                      R$ {selectedParticipant.balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-1">Valor Inicial</p>
                    <p className="text-lg font-semibold text-gray-800">
                      R$ {selectedParticipant.initialBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico de Transações */}
        {selectedParticipant && (
          <Card>
            <CardHeader>
              <CardTitle>Últimas Transações</CardTitle>
            </CardHeader>
            <CardContent>
              {getParticipantTransactions().length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma transação encontrada
                </p>
              ) : (
                <div className="space-y-3">
                  {getParticipantTransactions().map((transaction, index) => (
                    <div key={transaction.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={transaction.type === 'credit' ? "default" : "secondary"}>
                            {transaction.type === 'credit' ? '💰 Recarga' : '🛒 Compra'}
                          </Badge>
                          {transaction.booth && (
                            <span className="text-sm text-gray-500">• {transaction.booth}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default ConsultaSaldo;
