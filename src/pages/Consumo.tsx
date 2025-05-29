
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '../contexts/AppContext';
import { ShoppingCart, Search, Minus, Plus, Receipt, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Consumo: React.FC = () => {
  const { addTransaction, getParticipantByCard, participants, products, booths } = useApp();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [selectedBooth, setSelectedBooth] = useState('');
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [operatorName, setOperatorName] = useState('');
  const [customProduct, setCustomProduct] = useState({ name: '', price: 0 });

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

  const handleQRCodeSearch = () => {
    toast({
      title: "QR Code Scanner",
      description: "Em desenvolvimento - Use o número do cartão por enquanto",
    });
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
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const addCustomProduct = () => {
    if (!customProduct.name || customProduct.price <= 0) {
      toast({
        title: "Erro",
        description: "Preencha o nome e preço do produto personalizado",
        variant: "destructive",
      });
      return;
    }

    const product = {
      id: `custom-${Date.now()}`,
      name: customProduct.name,
      price: customProduct.price,
      booth: selectedBooth,
      isActive: true,
    };

    addToCart(product);
    setCustomProduct({ name: '', price: 0 });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos do carrinho",
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleSale = () => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive",
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione produtos ao carrinho",
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

    if (!operatorName) {
      toast({
        title: "Erro",
        description: "Nome do operador é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = getTotalAmount();

    if (selectedParticipant.balance < totalAmount) {
      toast({
        title: "Saldo Insuficiente",
        description: `Saldo atual: ${formatCurrency(selectedParticipant.balance)}. Valor da compra: ${formatCurrency(totalAmount)}`,
        variant: "destructive",
      });
      return;
    }

    // Criar descrição da venda
    const description = cart
      .map(item => `${item.quantity}x ${item.product.name}`)
      .join(', ');

    addTransaction({
      participantId: selectedParticipant.id,
      type: 'debit',
      amount: totalAmount,
      description: description,
      booth: selectedBooth,
      operatorName: operatorName,
    });

    toast({
      title: "Venda realizada!",
      description: `${formatCurrency(totalAmount)} debitado do cartão de ${selectedParticipant.name}`,
    });

    // Limpar formulário
    setCart([]);
    setSearchCard('');
    setSelectedParticipant(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const boothProducts = products.filter(p => p.booth === selectedBooth && p.isActive);

  return (
    <Layout title="Registro de Consumo">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🛒 Registro de Consumo
          </h1>
          <p className="text-gray-600">
            Registre vendas e debite valores dos cartões
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Busca e Seleção */}
          <div className="space-y-6">
            {/* Busca de Participante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-600" />
                  Buscar Participante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                    <Button onClick={handleQRCodeSearch} variant="outline">
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedParticipant && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">Participante Selecionado</h3>
                        <div className="space-y-1">
                          <p><span className="font-medium">Nome:</span> {selectedParticipant.name}</p>
                          <p><span className="font-medium">Cartão:</span> {selectedParticipant.cardNumber}</p>
                          <p><span className="font-medium">Saldo:</span> <span className="text-green-600 font-bold">{formatCurrency(selectedParticipant.balance)}</span></p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Barraca e Operador */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Venda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="booth">Barraca *</Label>
                  <Select value={selectedBooth} onValueChange={setSelectedBooth}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione uma barraca" />
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

                <div>
                  <Label htmlFor="operatorName">Nome do Vendedor *</Label>
                  <Input
                    id="operatorName"
                    placeholder="Digite seu nome"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Produtos */}
            {selectedBooth && (
              <Card>
                <CardHeader>
                  <CardTitle>Produtos - {selectedBooth}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {boothProducts.length > 0 ? (
                      boothProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                          </div>
                          <Button
                            onClick={() => addToCart(product)}
                            size="sm"
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Nenhum produto cadastrado para esta barraca
                      </p>
                    )}
                  </div>

                  {/* Produto Personalizado */}
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-3">Produto Personalizado</h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="Nome do produto"
                        value={customProduct.name}
                        onChange={(e) => setCustomProduct(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="Preço"
                          value={customProduct.price || ''}
                          onChange={(e) => setCustomProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="flex-1"
                        />
                        <Button onClick={addCustomProduct} variant="outline">
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Carrinho */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
                    Carrinho de Compras
                  </div>
                  {cart.length > 0 && (
                    <Button onClick={clearCart} variant="outline" size="sm">
                      Limpar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.length > 0 ? (
                    <>
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">{formatCurrency(item.product.price)} cada</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              size="sm"
                              variant="outline"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              size="sm"
                              variant="outline"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}

                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-green-600">{formatCurrency(getTotalAmount())}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleSale}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        disabled={!selectedParticipant || !selectedBooth || !operatorName}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Finalizar Venda - {formatCurrency(getTotalAmount())}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Carrinho vazio</p>
                      <p className="text-sm">Selecione uma barraca e adicione produtos</p>
                    </div>
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
