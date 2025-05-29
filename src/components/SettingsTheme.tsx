
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '../contexts/SettingsContext';
import { Palette, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsTheme: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [colors, setColors] = useState(settings.colors);

  const presetThemes = [
    {
      name: 'Católico Tradicional',
      colors: { primary: '#4F46E5', secondary: '#F8FAFC', accent: '#E0E7FF' }
    },
    {
      name: 'Festa Junina',
      colors: { primary: '#DC2626', secondary: '#FEF7ED', accent: '#FED7AA' }
    },
    {
      name: 'Verde e Amarelo',
      colors: { primary: '#16A34A', secondary: '#FFFBEB', accent: '#FDE047' }
    },
    {
      name: 'Azul Marinho',
      colors: { primary: '#1E40AF', secondary: '#F0F9FF', accent: '#BAE6FD' }
    }
  ];

  const handleSave = () => {
    updateSettings({ colors });
    toast({
      title: "Tema atualizado!",
      description: "As cores do sistema foram alteradas com sucesso.",
    });
  };

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setColors(preset.colors);
    updateSettings({ colors: preset.colors });
    toast({
      title: "Tema aplicado!",
      description: `Tema "${preset.name}" foi aplicado com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Cores Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary">Cor Primária</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="primary"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => setColors(prev => ({ ...prev, primary: e.target.value }))}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => setColors(prev => ({ ...prev, primary: e.target.value }))}
                  placeholder="#4F46E5"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary">Cor Secundária</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="secondary"
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => setColors(prev => ({ ...prev, secondary: e.target.value }))}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) => setColors(prev => ({ ...prev, secondary: e.target.value }))}
                  placeholder="#F8FAFC"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accent">Cor de Destaque</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="accent"
                  type="color"
                  value={colors.accent}
                  onChange={(e) => setColors(prev => ({ ...prev, accent: e.target.value }))}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={colors.accent}
                  onChange={(e) => setColors(prev => ({ ...prev, accent: e.target.value }))}
                  placeholder="#E0E7FF"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Aplicar Cores Personalizadas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Temas Prontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presetThemes.map((preset, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">{preset.name}</h3>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: preset.colors.primary }}
                    title="Primária"
                  />
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: preset.colors.secondary }}
                    title="Secundária"
                  />
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ backgroundColor: preset.colors.accent }}
                    title="Destaque"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyPreset(preset)}
                  className="w-full"
                >
                  Aplicar Tema
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTheme;
