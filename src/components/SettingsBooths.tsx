import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Store, Package, Gift } from 'lucide-react';
import { useApp } from '../contexts/LocalAppContext';
import { toast } from '@/hooks/use-toast';

interface ProductForm {
  name: string;
  price: number;
  isFree: boolean;
}

const SettingsBooths: React.FC = () => {
  const { participants, transactions, products, booths, closingOptions, settings, addParticipant, updateParticipant, deleteParticipant, getParticipantByCard, addTransaction, addProduct, updateProduct, deleteProduct, addBooth, updateBooth, deleteBooth, addClosingOption, saveSettings, clearAllData, getTotalSales, getTotalActiveBalance, isFestivalActive } = useApp();
  const [newBoothName, setNewBoothName] = useState('');
  const [boothProducts, setBoothProducts] = useState<ProductForm[]>([]);

  const addProductToBooth = () => {
    setBoothProducts([...boothProducts, { name: '', price: 0, isFree: false }]);
  };

  const updateBoothProduct = (index: number, field: keyof ProductForm, value: any) => {
    const updatedProducts = boothProducts.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setBoothProducts(updatedProducts);
  };

  const removeBoothProduct = (index: number) => {
    setBoothProducts(boothProducts.filter((_, i) => i !== index));
  };

  const handleAddBooth = () => {
    if (!newBoothName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da barraca é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (booths.some(booth => booth.name.toLowerCase() === newBoothName.trim().toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe uma barraca com este nome",
        variant: "destructive",
      });
      return;
    }

    // Validar produtos
    for (let i = 0; i < boothProducts.length; i++) {
      const product = boothProducts[i];
      if (!product.name.trim()) {
        toast({
          title: "Erro",
          description: `Nome do produto ${i + 1} é obrigatório`,
          variant: "destructive",
        });
        return;
      }
      if (!product.isFree && product.price <= 0) {
        toast({
          title: "Erro",
          description: `Preço do produto "${product.name}" deve ser maior que zero`,
          variant: "destructive",
        });
        return;
      }
    }

    // Criar barraca
    const newBooth = addBooth({
      name: newBoothName.trim(),
      isActive: true,
    });

    // Adicionar produtos à barraca
    boothProducts.forEach(product => {
      if (product.name.trim()) {
        addProduct({
          name: product.name.trim(),
          price: product.isFree ? 0 : product.price,
          booth: newBoothName.trim(),
          isActive: true,
          isFree: product.isFree,
        });
      }
    });

    setNewBoothName('');
    setBoothProducts([]);
    toast({
      title: "Sucesso",
      description: `Barraca "${newBoothName.trim()}" adicionada com ${boothProducts.length} produtos!`,
    });
  };

  const handleDeleteBooth = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a barraca "${name}"?`)) {
      deleteBooth(id);
      toast({
        title: "Sucesso",
        description: "Barraca excluída com sucesso!",
      });
    }
  };

  const toggleBoothStatus = (id: string, currentStatus: boolean) => {
    updateBooth(id, { isActive: !currentStatus });
    toast({
      title: "Sucesso",
      description: `Barraca ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Cadastrar Nova Barraca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="booth-name">Nome da Barraca *</Label>
            <Input
              id="booth-name"
              placeholder="Ex: Doces e Salgados"
              value={newBoothName}
              onChange={(e) => setNewBoothName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produtos da Barraca
              </h4>
              <Button onClick={addProductToBooth} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Produto
              </Button>
            </div>

            {boothProducts.map((product, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Produto {index + 1}</h5>
                  <Button
                    onClick={() => removeBoothProduct(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Nome do Produto *</Label>
                    <Input
                      placeholder="Ex: Coxinha"
                      value={product.name}
                      onChange={(e) => updateBoothProduct(index, 'name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={product.price || ''}
                      onChange={(e) => updateBoothProduct(index, 'price', parseFloat(e.target.value) || 0)}
                      disabled={product.isFree}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`free-${index}`}
                    checked={product.isFree}
                    onChange={(e) => {
                      updateBoothProduct(index, 'isFree', e.target.checked);
                      if (e.target.checked) {
                        updateBoothProduct(index, 'price', 0);
                      }
                    }}
                    className="rounded"
                  />
                  <Label htmlFor={`free-${index}`} className="flex items-center gap-1">
                    <Gift className="h-4 w-4 text-green-600" />
                    Brinde (Grátis)
                  </Label>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleAddBooth} className="w-full">
            <Store className="h-4 w-4 mr-2" />
            Criar Barraca com Produtos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barracas Cadastradas ({booths.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {booths.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma barraca cadastrada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {booths.map((booth) => {
                const boothProductsCount = products.filter(p => p.booth === booth.name).length;
                return (
                  <div
                    key={booth.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="font-medium">{booth.name}</span>
                        <p className="text-sm text-gray-500">
                          {boothProductsCount} produto(s) cadastrado(s)
                        </p>
                      </div>
                      <Badge variant={booth.isActive ? "default" : "secondary"}>
                        {booth.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBoothStatus(booth.id, booth.isActive)}
                      >
                        {booth.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBooth(booth.id, booth.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsBooths;
