
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '../contexts/AppContext';
import { Store, Plus, Trash2, Edit3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Booth } from '@/types';

const SettingsBooths: React.FC = () => {
  const { booths, addBooth, updateBooth, deleteBooth } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da barraca é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (editingBooth) {
      updateBooth(editingBooth.id, {
        name: formData.name,
        totalSales: editingBooth.totalSales
      });
      
      toast({
        title: "Barraca atualizada!",
        description: "A barraca foi atualizada com sucesso",
      });
    } else {
      addBooth({
        name: formData.name,
        isActive: true,
        totalSales: 0
      });

      toast({
        title: "Barraca criada!",
        description: "Nova barraca foi adicionada com sucesso",
      });
    }

    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingBooth(null);
  };

  const handleEdit = (booth: Booth) => {
    setEditingBooth(booth);
    setFormData({
      name: booth.name,
      description: ''
    });
    setShowForm(true);
  };

  const handleDelete = (boothId: string) => {
    if (confirm('Tem certeza que deseja excluir esta barraca? Esta ação não pode ser desfeita.')) {
      deleteBooth(boothId);
      toast({
        title: "Barraca excluída",
        description: "A barraca foi removida do sistema",
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingBooth(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Gerenciar Barracas
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)} disabled={editingBooth !== null}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Barraca
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg space-y-4">
              <div>
                <Label htmlFor="name">Nome da Barraca *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Barraca de Doces, Pescaria, etc."
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingBooth ? 'Atualizar' : 'Criar'} Barraca
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {booths.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma barraca cadastrada ainda
              </p>
            ) : (
              booths.map(booth => (
                <div key={booth.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{booth.name}</div>
                    <div className="text-sm text-gray-500">
                      Vendas totais: R$ {booth.totalSales.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Status: {booth.isActive ? 'Ativa' : 'Inativa'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(booth)}
                      disabled={showForm}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(booth.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsBooths;
