
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '../contexts/SettingsContext';
import { CheckCircle, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsEncerramento: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [autoCloseTime, setAutoCloseTime] = useState(settings.endTime || '23:00');
  const [enableAutoClose, setEnableAutoClose] = useState(false);
  const [closingMessage, setClosingMessage] = useState('Festa encerrada! Obrigado pela participação.');
  const [requireConfirmation, setRequireConfirmation] = useState(true);

  const handleSaveEncerramentoSettings = () => {
    updateSettings({
      endTime: autoCloseTime,
    });

    toast({
      title: "Configurações salvas!",
      description: "As configurações de encerramento foram atualizadas",
    });
  };

  const handleForceClose = () => {
    if (requireConfirmation && !confirm('Tem certeza que deseja encerrar a festa agora? Esta ação não pode ser desfeita.')) {
      return;
    }

    updateSettings({
      isActive: false,
    });

    toast({
      title: "Festa encerrada!",
      description: "O sistema foi desativado com sucesso",
      variant: "destructive",
    });
  };

  const handleReactivate = () => {
    updateSettings({
      isActive: true,
    });

    toast({
      title: "Sistema reativado!",
      description: "A festa foi reativada com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Configurações de Encerramento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="autoCloseTime">Horário de Encerramento Automático</Label>
              <Input
                id="autoCloseTime"
                type="time"
                value={autoCloseTime}
                onChange={(e) => setAutoCloseTime(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableAutoClose"
                checked={enableAutoClose}
                onCheckedChange={setEnableAutoClose}
              />
              <Label htmlFor="enableAutoClose">Ativar encerramento automático</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="closingMessage">Mensagem de Encerramento</Label>
            <Textarea
              id="closingMessage"
              value={closingMessage}
              onChange={(e) => setClosingMessage(e.target.value)}
              placeholder="Mensagem exibida quando a festa for encerrada"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="requireConfirmation"
              checked={requireConfirmation}
              onCheckedChange={setRequireConfirmation}
            />
            <Label htmlFor="requireConfirmation">Exigir confirmação para ações críticas</Label>
          </div>

          <Button onClick={handleSaveEncerramentoSettings} className="w-full">
            Salvar Configurações de Encerramento
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Estado da Festa</p>
              <p className="text-sm text-gray-500">
                {settings.isActive ? 'Sistema ativo e funcionando' : 'Sistema desativado'}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              settings.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {settings.isActive ? 'ATIVO' : 'INATIVO'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.isActive ? (
              <Button 
                onClick={handleForceClose} 
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Encerrar Festa Agora
              </Button>
            ) : (
              <Button 
                onClick={handleReactivate} 
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Reativar Sistema
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsEncerramento;
