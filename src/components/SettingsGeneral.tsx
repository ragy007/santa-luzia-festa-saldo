
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '../contexts/SettingsContext';
import { Save, Upload, Calendar, MapPin, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsGeneral: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState({
    name: settings.name,
    date: settings.date,
    location: settings.location,
    phone: settings.phone || '',
    logoUrl: settings.logoUrl || ''
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Informações da Festa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome da Festa</Label>
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
            <Label htmlFor="location">Local da Festa</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Centro Social Paróquia Santa Luzia"
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
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SettingsGeneral;
