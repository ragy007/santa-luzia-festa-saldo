
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from '@/hooks/use-toast';
import { 
  Heart, 
  Church, 
  Cross, 
  Star, 
  Sun, 
  Moon, 
  Crown, 
  Sparkles,
  Shield,
  Gem,
  Flame,
  TreePine
} from 'lucide-react';

const iconOptions = [
  { value: 'Heart', label: 'Coração', icon: Heart },
  { value: 'Church', label: 'Igreja', icon: Church },
  { value: 'Cross', label: 'Cruz', icon: Cross },
  { value: 'Star', label: 'Estrela', icon: Star },
  { value: 'Sun', label: 'Sol', icon: Sun },
  { value: 'Moon', label: 'Lua', icon: Moon },
  { value: 'Crown', label: 'Coroa', icon: Crown },
  { value: 'Sparkles', label: 'Brilho', icon: Sparkles },
  { value: 'Shield', label: 'Escudo', icon: Shield },
  { value: 'Gem', label: 'Joia', icon: Gem },
  { value: 'Flame', label: 'Chama', icon: Flame },
  { value: 'TreePine', label: 'Árvore', icon: TreePine },
];

const SettingsIcons: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [primaryIcon, setPrimaryIcon] = useState(settings.primaryIcon || 'Heart');
  const [secondaryIcon, setSecondaryIcon] = useState(settings.secondaryIcon || 'Church');

  const handleSave = () => {
    updateSettings({ 
      primaryIcon, 
      secondaryIcon 
    });
    
    toast({
      title: "✅ Ícones atualizados!",
      description: "As configurações dos ícones foram salvas com sucesso."
    });
  };

  const renderIconPreview = (iconValue: string, label: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconValue);
    if (!iconOption) return null;
    
    const IconComponent = iconOption.icon;
    return (
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{iconOption.label}</p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Ícones Religiosos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="primary-icon">Ícone Principal</Label>
            <Select value={primaryIcon} onValueChange={setPrimaryIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ícone principal" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {renderIconPreview(primaryIcon, "Ícone Principal")}
          </div>

          <div className="space-y-3">
            <Label htmlFor="secondary-icon">Ícone Secundário</Label>
            <Select value={secondaryIcon} onValueChange={setSecondaryIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ícone secundário" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {renderIconPreview(secondaryIcon, "Ícone Secundário")}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleSave} className="w-full">
            💾 Salvar Configurações dos Ícones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsIcons;
