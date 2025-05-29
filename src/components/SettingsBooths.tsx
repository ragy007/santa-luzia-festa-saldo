
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Store } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const SettingsBooths: React.FC = () => {
  const { state, addBooth, updateBooth, deleteBooth } = useApp();
  const [newBoothName, setNewBoothName] = useState('');

  const handleAddBooth = () => {
    if (!newBoothName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da barraca é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (state.booths.some(booth => booth.name.toLowerCase() === newBoothName.trim().toLowerCase())) {
      toast({
        title: "Erro",
        description: "Já existe uma barraca com este nome",
        variant: "destructive",
      });
      return;
    }

    addBooth({
      name: newBoothName.trim(),
      isActive: true,
    });

    setNewBoothName('');
    toast({
      title: "Sucesso",
      description: "Barraca adicionada com sucesso!",
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
            Gerenciar Barracas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="booth-name">Nome da Barraca</Label>
              <Input
                id="booth-name"
                placeholder="Ex: Doces e Salgados"
                value={newBoothName}
                onChange={(e) => setNewBoothName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddBooth()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddBooth} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barracas Cadastradas ({state.booths.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {state.booths.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma barraca cadastrada ainda
            </p>
          ) : (
            <div className="space-y-3">
              {state.booths.map((booth) => (
                <div
                  key={booth.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Store className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{booth.name}</span>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsBooths;
