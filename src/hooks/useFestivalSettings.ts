
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Settings } from '@/types/settings';
import { toast } from '@/hooks/use-toast';

export const useFestivalSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar configurações do Supabase
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('festival_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const mappedSettings: Settings = {
          name: data.name,
          location: data.location,
          logoUrl: data.logo_url || '',
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          theme: data.theme,
          date: data.date,
          startTime: data.start_time,
          endTime: data.end_time,
          isActive: data.is_active,
          phone: data.phone,
          title: data.title,
          subtitle: data.subtitle,
          religiousMessage: data.religious_message,
          primaryIcon: data.primary_icon,
          secondaryIcon: data.secondary_icon,
          colors: {
            primary: data.primary_color,
            secondary: data.secondary_color,
            accent: data.accent_color,
          },
        };
        setSettings(mappedSettings);
        
        // Forçar atualização no contexto local também
        window.dispatchEvent(new CustomEvent('settings-updated', { 
          detail: mappedSettings 
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações
  const saveSettings = async (newSettings: Partial<Settings>) => {
    try {
      const { error } = await supabase
        .from('festival_settings')
        .upsert({
          name: newSettings.name,
          location: newSettings.location,
          logo_url: newSettings.logoUrl,
          primary_color: newSettings.primaryColor,
          secondary_color: newSettings.secondaryColor,
          accent_color: newSettings.colors?.accent,
          theme: newSettings.theme,
          date: newSettings.date,
          start_time: newSettings.startTime,
          end_time: newSettings.endTime,
          is_active: newSettings.isActive,
          phone: newSettings.phone,
          title: newSettings.title,
          subtitle: newSettings.subtitle,
          religious_message: newSettings.religiousMessage,
          primary_icon: newSettings.primaryIcon,
          secondary_icon: newSettings.secondaryIcon,
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      // Atualizar estado local imediatamente
      setSettings(prev => prev ? { ...prev, ...newSettings } : prev);
      
      // Forçar atualização em outros componentes
      window.dispatchEvent(new CustomEvent('settings-updated', { 
        detail: { ...settings, ...newSettings }
      }));

      toast({
        title: "Sucesso!",
        description: "Configurações salvas com sucesso"
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Configurar realtime
  useEffect(() => {
    loadSettings();

    const channel = supabase
      .channel('festival-settings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'festival_settings' }, 
        () => {
          loadSettings();
        }
      )
      .subscribe();

    // Escutar eventos customizados
    const handleSettingsUpdate = (event: any) => {
      if (event.detail) {
        setSettings(event.detail);
      }
    };

    window.addEventListener('settings-updated', handleSettingsUpdate);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('settings-updated', handleSettingsUpdate);
    };
  }, []);

  return {
    settings,
    loading,
    saveSettings
  };
};
