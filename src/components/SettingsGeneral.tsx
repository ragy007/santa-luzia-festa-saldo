
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '../contexts/SettingsContext';
import { Save, Upload, Calendar, MapPin, Building, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsGeneral: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    name: settings.name,
    date: settings.date,
    location: settings.location,
    phone: settings.phone || '',
    logoUrl: settings.logoUrl || '',
    title: settings.title || 'Festa Comunitária 2024',
    subtitle: settings.subtitle || 'Centro Social da Paróquia Santa Luzia',
    religiousMessage: settings.religiousMessage || 'Sob a proteção de Santa Maria Auxiliadora e São João Bosco'
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

  return (
    <div className="space-y-6">
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
