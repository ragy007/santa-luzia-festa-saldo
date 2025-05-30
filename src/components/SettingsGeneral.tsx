import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useSettings } from '../contexts/SettingsContext';
import { useApp } from '../contexts/AppContext';
import { Save, Upload, Calendar, MapPin, Building, Heart, Clock, Power, Trash2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsGeneral: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const { clearAllData } = useApp();
  const [formData, setFormData] = useState({
    name: settings.name,
    date: settings.date,
    location: settings.location,
    phone: settings.phone || '',
    logoUrl: settings.logoUrl || '',
    title: settings.title || 'Festa Comunitária 2024',
    subtitle: settings.subtitle || 'Centro Social da Paróquia Santa Luzia',
    religiousMessage: settings.religiousMessage || 'Sob a proteção de Santa Maria Auxiliadora e São João Bosco',
    isActive: settings.isActive,
    startTime: settings.startTime,
    endTime: settings.endTime
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast({
      title: "Configurações salvas!",
      description: "As configurações da festa foram atualizadas com sucesso.",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        setFormData(prev => ({ ...prev, logoUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearAllData = () => {
    clearAllData();
    toast({
      title: "🗑️ Dados limpos!",
      description: "Todos os dados da festa anterior foram removidos. Você pode começar uma nova festa.",
    });
  };

  const handleNewFestival = () => {
    // Limpar todos os dados
    clearAllData();
    
    // Resetar configurações para uma nova festa
    const today = new Date().toISOString().split('T')[0];
    const newSettings = {
      ...formData,
      date: today,
      isActive: true
    };
    
    setFormData(newSettings);
    updateSettings(newSettings);
    
    toast({
      title: "🎉 Nova festa criada!",
      description: "Todos os dados foram limpos e as configurações foram resetadas para uma nova festa.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Power className="h-5 w-5 mr-2 text-green-600" />
            Controle da Festa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="festival-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="festival-active">
                  {formData.isActive ? 'Festa Ativada' : 'Festa Desativada'}
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Horário de Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">Horário de Término</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Controle da Festa
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <RefreshCw className="h-5 w-5 mr-2" />
            Nova Festa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-orange-700 text-sm">
            Use esta opção quando quiser começar uma nova festa. Isso irá limpar todos os dados 
            (participantes, transações, vendas) e resetar as configurações.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                <RefreshCw className="h-4 w-4 mr-2" />
                Criar Nova Festa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>🎉 Criar Nova Festa</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá:
                  <br />• Limpar todos os participantes cadastrados
                  <br />• Remover todas as transações e vendas
                  <br />• Resetar estatísticas e relatórios
                  <br />• Atualizar a data da festa para hoje
                  <br /><br />
                  <strong>Esta ação não pode ser desfeita!</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleNewFestival} className="bg-orange-600 hover:bg-orange-700">
                  Sim, Criar Nova Festa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <Trash2 className="h-5 w-5 mr-2" />
            Limpeza de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-700 text-sm">
            Use esta opção apenas se precisar limpar todos os dados sem alterar as configurações da festa atual.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos os Dados
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>⚠️ Limpar Todos os Dados</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover permanentemente:
                  <br />• Todos os participantes cadastrados
                  <br />• Todas as transações (recargas e consumos)
                  <br />• Histórico de vendas por barraca
                  <br />• Dados de encerramento
                  <br /><br />
                  <strong>Esta ação não pode ser desfeita!</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllData} className="bg-red-600 hover:bg-red-700">
                  Sim, Limpar Dados
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-blue-600" />
            Personalização da Festa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Título Principal da Festa</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Festa Comunitária 2024"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Aparece no cabeçalho e dashboard</p>
              </div>

              <div>
                <Label htmlFor="subtitle">Local da Festa</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Centro Social da Paróquia Santa Luzia"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Nome do local onde acontece a festa</p>
              </div>

              <div>
                <Label htmlFor="religiousMessage">Mensagem Religiosa</Label>
                <Input
                  id="religiousMessage"
                  value={formData.religiousMessage}
                  onChange={(e) => setFormData(prev => ({ ...prev, religiousMessage: e.target.value }))}
                  placeholder="Sob a proteção de Santa Maria Auxiliadora e São João Bosco"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Mensagem de proteção ou invocação religiosa</p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Personalização
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Evento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Festa Junina 2024"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="date">Data da Festa</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Endereço Completo</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Rua das Flores, 123 - Centro"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone de Contato</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="logo">Logo da Festa</Label>
              <div className="mt-2 space-y-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.logoUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.logoUrl} 
                      alt="Logo da festa" 
                      className="h-20 w-20 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações Gerais
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsGeneral;
