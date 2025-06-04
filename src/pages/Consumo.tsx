import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '../contexts/LocalAppContext';
import { useAuth } from '@/contexts/LocalAuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { ShoppingCart, Search, AlertCircle, TrendingDown, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PrintReceipt from '../components/PrintReceipt';

const Consumo: React.FC = () => {
  const { addTransaction, getParticipantByCard, participants, transactions } = useApp();
  const { user } = useAuth();
  const { booths } = useSettings();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [selectedBooth, setSelectedBooth] = useState('');
  const [items, setItems] = useState('');
  const [lastPurchase, setLastPurchase] = useState<any>(null);
  const [showPrintButton, setShowPrintButton] = useState(false);

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
        description: `${participant.name} - Saldo: ${formatCurrency(participant.balance)}`,
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

  const handlePurchase = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive",
      });
      return;
    }

    if (purchaseAmount <= 0) {
      toast({
        title: "Erro",
        description: "Valor da compra deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (selectedParticipant.balance < purchaseAmount) {
      toast({
        title: "Saldo insuficiente!",
        description: `Saldo disponível: ${formatCurrency(selectedParticipant.balance)}`,
        variant: "destructive",
      });
      return;
    }

    if (!selectedBooth) {
      toast({
        title: "Erro",
        description: "Selecione uma barraca",
        variant: "destructive",
      });
      return;
    }

    const previousBalance = selectedParticipant.balance;

    addTransaction({
      participantId: selectedParticipant.id,
      type: 'debit',
      amount: purchaseAmount,
      description: items || 'Compra na festa',
      booth: selectedBooth,
      operatorName: operatorName,
    });

    // Salvar dados para impressão
    setLastPurchase({
      participantName: selectedParticipant.name,
      cardNumber: selectedParticipant.cardNumber,
      amount: purchaseAmount,
      balance: previousBalance - purchaseAmount,
      items: items || 'Compra na festa',
      operatorName: operatorName
    });

    // Mostrar botão de impressão
    setShowPrintButton(true);

    toast({
      title: "Venda registrada!",
      description: `${formatCurrency(purchaseAmount)} debitado do cartão de ${selectedParticipant.name}`,
    });

    // Limpar formulário
    setPurchaseAmount(0);
    setItems('');
    setSearchCard('');
    setSelectedParticipant(null);
    setSelectedBooth('');
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

  const recentSales = transactions
    .filter(t => t.type === 'debit')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const totalSales = transactions
    .filter(t => t.type === 'debit')
    .reduce((total, t) => total + t.amount, 0);

  const todaySales = transactions
    .filter(t => t.type === 'debit' && 
      new Date(t.timestamp).toDateString() === new Date().toDateString()
    )
    .reduce((total, t) => total + t.amount, 0);

  return (
    <Layout title="Registrar Vendas">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🛍️ Registrar Vendas
          </h1>
          <p className="text-gray-600">
            Registre vendas e débitos dos participantes
          </p>
          <p className="text-sm text-blue-600 font-medium mt-1">
            Operador: {operatorName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Venda */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
                  Nova Venda
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
                  <Card className={`${
                    selectedParticipant.balance >= purchaseAmount ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <CardContent className="p-4">
                      <h3 className={`font-semibold mb-2 ${
                        selectedParticipant.balance >= purchaseAmount ? 'text-blue-800' : 'text-red-800'
                      }`}>
                        Participante Selecionado
                      </h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Nome:</span> {selectedParticipant.name}</p>
                        <p><span className="font-medium">Cartão:</span> {selectedParticipant.cardNumber}</p>
                        <p><span className="font-medium">Saldo Atual:</span> 
                          <span className={`font-bold ml-1 ${
                            selectedParticipant.balance >= purchaseAmount ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(selectedParticipant.balance)}
                          </span>
                        </p>
                        {purchaseAmount > 0 && (
                          <p><span className="font-medium">Saldo Após Compra:</span> 
                            <span className={`font-bold ml-1 ${
                              selectedParticipant.balance >= purchaseAmount ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(selectedParticipant.balance - purchaseAmount)}
                            </span>
                          </p>
                        )}
                      </div>
                      {selectedParticipant.balance < purchaseAmount && purchaseAmount > 0 && (
                        <div className="flex items-center mt-2 p-2 bg-red-100 rounded">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-red-700 text-sm">Saldo insuficiente para esta compra</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Formulário de Venda */}
                {selectedParticipant && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="purchaseAmount">Valor da Venda *</Label>
                        <Input
                          id="purchaseAmount"
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0,00"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="booth">Barraca *</Label>
                        <Select value={selectedBooth} onValueChange={setSelectedBooth}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione a barraca" />
                          </SelectTrigger>
                          <SelectContent>
                            {booths.filter(b => b.isActive).map((booth) => (
                              <SelectItem key={booth.id} value={booth.name}>
                                {booth.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="items">Itens/Descrição (Opcional)</Label>
                      <Input
                        id="items"
                        placeholder="Ex: 2x Pastel, 1x Refrigerante"
                        value={items}
                        onChange={(e) => setItems(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Botões de Valores Rápidos */}
                    <div className="space-y-2">
                      <Label>Valores Rápidos</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[5, 10, 15, 20, 25, 30].map((value) => (
                          <Button
                            key={value}
                            type="button"
                            variant="outline"
                            onClick={() => setPurchaseAmount(value)}
                            className="text-sm"
                          >
                            R$ {value}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handlePurchase} 
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                      disabled={!purchaseAmount || !selectedBooth || selectedParticipant.balance < purchaseAmount}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Registrar Venda de {formatCurrency(purchaseAmount)}
                    </Button>
                  </div>
                )}

                {/* Botão de Impressão - só aparece após a venda */}
                {showPrintButton && lastPurchase && (
                  <div className="flex justify-center pt-4 border-t">
                    <PrintReceipt
                      type="consumo"
                      data={lastPurchase}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPrintButton(false)}
                      className="ml-2"
                    >
                      Nova Venda
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo e Histórico */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  Resumo de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Total Vendido:</span>
                    <span className="font-bold text-purple-800">{formatCurrency(totalSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Vendas Hoje:</span>
                    <span className="font-bold text-purple-800">{formatCurrency(todaySales)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-orange-600" />
                  Vendas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales.map((sale) => {
                    const participant = participants.find(p => p.id === sale.participantId);
                    return (
                      <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{participant?.name}</p>
                          <p className="text-sm text-gray-500">
                            {sale.booth} • {formatTime(sale.timestamp)}
                          </p>
                          <p className="text-xs text-gray-400">{sale.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">-{formatCurrency(sale.amount)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {recentSales.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Nenhuma venda registrada ainda
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

export default Consumo;
