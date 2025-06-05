
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, User, CreditCard, Receipt, Gift } from 'lucide-react';
import QRCodeScanner from '../components/QRCodeScanner';
import { useApp } from '../contexts/LocalAppContext';
import { useAuth } from '../contexts/LocalAuthContext';
import { toast } from '@/hooks/use-toast';
import PrintReceipt from '../components/PrintReceipt';

const Consumo: React.FC = () => {
  const { user, isOperator } = useAuth();
  const { 
    participants, 
    products, 
    addTransaction, 
    getParticipantByCard, 
    updateParticipant 
  } = useApp();
  
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cart, setCart] = useState<Array<{product: any; quantity: number}>>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  // Filtrar produtos da barraca do operador
  const operatorProducts = products.filter(product => 
    product.isActive && 
    user?.boothName && 
    product.booth === user.boothName
  );

  console.log('Operador logado:', user?.name, 'Barraca:', user?.boothName);
  console.log('Produtos disponíveis:', products);
  console.log('Produtos da barraca do operador:', operatorProducts);

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
    setCart([]);
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

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.product.id !== productId));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleSale = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione produtos ao carrinho",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = getTotalAmount();

    if (selectedParticipant.balance < totalAmount) {
      toast({
        title: "Saldo insuficiente",
        description: `Saldo atual: R$ ${selectedParticipant.balance.toFixed(2)} | Necessário: R$ ${totalAmount.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    // Registrar transação
    const transaction = {
      participantId: selectedParticipant.id,
      type: 'debit' as const,
      amount: totalAmount,
      description: cart.map(item => `${item.quantity}x ${item.product.name}`).join(', '),
      booth: user?.boothName || '',
      operatorName: user?.name || 'Operador'
    };

    addTransaction(transaction);

    // Atualizar saldo do participante
    updateParticipant(selectedParticipant.id, {
      balance: selectedParticipant.balance - totalAmount
    });

    // Preparar dados para o recibo
    setLastTransaction({
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      participant: selectedParticipant,
      items: cart,
      total: totalAmount
    });

    toast({
      title: "Venda realizada!",
      description: `Total: R$ ${totalAmount.toFixed(2)}`,
    });

    // Limpar formulário
    setSelectedParticipant(null);
    setCardNumber('');
    setCart([]);
    setShowReceipt(true);
  };

  return (
    <Layout title="Consumo">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🛒 Registrar Consumo
          </h1>
          <p className="text-gray-600">
            {user?.boothName ? `Barraca: ${user.boothName}` : 'Registre vendas e consumos dos participantes'}
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
                    <p className="text-sm text-green-600">Saldo Disponível</p>
                    <p className="text-xl font-bold text-green-800">
                      R$ {selectedParticipant.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos Disponíveis */}
        {selectedParticipant && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Produtos Disponíveis - {user?.boothName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {operatorProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Nenhum produto cadastrado para esta barraca</p>
                  <p className="text-sm text-gray-400">
                    Produtos precisam ser cadastrados na aba "Barracas" das configurações
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {operatorProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            {product.isFree ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Gift className="h-3 w-3 mr-1" />
                                Grátis
                              </Badge>
                            ) : (
                              <p className="text-lg font-bold text-blue-600">
                                R$ {product.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full"
                        variant="outline"
                      >
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Carrinho */}
        {cart.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Carrinho de Compras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">
                      {item.product.isFree ? 'Grátis' : `R$ ${item.product.price.toFixed(2)} cada`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToCart(item.product)}
                    >
                      +
                    </Button>
                    <div className="w-20 text-right font-medium">
                      {item.product.isFree ? 'R$ 0,00' : `R$ ${(item.product.price * item.quantity).toFixed(2)}`}
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>R$ {getTotalAmount().toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={handleSale}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Finalizar Venda
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
                Venda Realizada com Sucesso!
              </CardTitle>
              <Button 
                variant="outline"
                onClick={() => setShowReceipt(false)}
              >
                Fechar
              </Button>
            </CardHeader>
            <CardContent>
              <PrintReceipt transaction={lastTransaction} />
            </CardContent>
          </Card>
        )}

        {/* Scanner QR Code */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Escanear QR Code</h3>
              <QRCodeScanner onScan={handleQRCodeScan} />
              <Button 
                variant="outline" 
                onClick={() => setShowScanner(false)}
                className="w-full mt-4"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Consumo;
