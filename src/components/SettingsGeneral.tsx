
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useSettings } from '../contexts/SettingsContext';
import { useApp } from '../contexts/LocalAppContext';
import { Save, Power, RefreshCw, Trash2, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsGeneral: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { clearAllData } = useApp();
  
  const [formData, setFormData] = useState({
    // Controle da Festa
    isActive: settings.isActive,
    startTime: settings.startTime,
    endTime: settings.endTime,
    // Informações da Festa
    name: settings.name,
    title: settings.title || 'Festa Comunitária 2025',
    subtitle: settings.subtitle || 'Centro Social da Paróquia Santa Luzia',
    date: settings.date,
    location: settings.location,
    phone: settings.phone || '',
    religiousMessage: settings.religiousMessage || '',
    logoUrl: settings.logoUrl || ''
  });

  // Atualizar quando settings mudar
  useEffect(() => {
    setFormData({
      isActive: settings.isActive,
      startTime: settings.startTime,
      endTime: settings.endTime,
      name: settings.name,
      title: settings.title || 'Festa Comunitária 2025',
      subtitle: settings.subtitle || 'Centro Social da Paróquia Santa Luzia',
      date: settings.date,
      location: settings.location,
      phone: settings.phone || '',
      religiousMessage: settings.religiousMessage || '',
      logoUrl: settings.logoUrl || ''
    });
  }, [settings]);

  const handleSave = () => {
    try {
      updateSettings(formData);
      toast({
        title: "✅ Configurações salvas!",
        description: "Todas as configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        handleInputChange('logoUrl', logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewFestival = () => {
    clearAllData();
    const today = new Date().toISOString().split('T')[0];
    const resetData = {
      ...formData,
      date: today,
      isActive: true
    };
    setFormData(resetData);
    updateSettings(resetData);
    
    toast({
      title: "🎉 Nova festa criada!",
      description: "Todos os dados foram limpos e as configurações resetadas.",
    });
  };

  const handleClearData = () => {
    clearAllData();
    toast({
      title: "🗑️ Dados limpos!",
      description: "Todos os dados da festa foram removidos.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Controle da Festa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Power className="h-5 w-5 mr-2 text-green-600" />
            Controle da Festa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label>
              {formData.isActive ? '🟢 Festa Ativa' : '🔴 Festa Inativa'}
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Início</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Término</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Festa */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Informações da Festa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Evento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Festa Junina 2025"
            />
          </div>

          <div>
            <Label htmlFor="title">Título Principal</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Festa Comunitária 2025"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Local da Festa</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Centro Social da Paróquia Santa Luzia"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Endereço</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Rua das Flores, 123 - Centro"
            />
          </div>

          <div>
            <Label htmlFor="religiousMessage">Mensagem Religiosa</Label>
            <Input
              id="religiousMessage"
              value={formData.religiousMessage}
              onChange={(e) => handleInputChange('religiousMessage', e.target.value)}
              placeholder="Sob a proteção de Santa Maria Auxiliadora"
            />
          </div>

          <div>
            <Label htmlFor="logo">Logo da Festa</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1"
            />
            {formData.logoUrl && (
              <div className="mt-2">
                <img 
                  src={formData.logoUrl} 
                  alt="Logo da festa" 
                  className="h-16 w-16 object-contain border rounded"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Todas as Configurações
      </Button>

      {/* Ações Especiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Nova Festa
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>🎉 Criar Nova Festa</AlertDialogTitle>
              <AlertDialogDescription>
                Isso irá limpar todos os dados (participantes, transações, vendas) e resetar para uma nova festa.
                <br /><strong>Esta ação não pode ser desfeita!</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleNewFestival} className="bg-orange-600 hover:bg-orange-700">
                Criar Nova Festa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Dados
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>⚠️ Limpar Todos os Dados</AlertDialogTitle>
              <AlertDialogDescription>
                Isso irá remover todos os participantes, transações e dados de vendas.
                <br /><strong>Esta ação não pode ser desfeita!</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearData} className="bg-red-600 hover:bg-red-700">
                Limpar Dados
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsGeneral;
