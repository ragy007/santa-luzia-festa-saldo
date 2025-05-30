
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
        .single();

      if (error) {
        console.error('Error loading settings:', error);
        // Se não há configurações, criar com padrões
        if (error.code === 'PGRST116') {
          const defaultSettings = await createDefaultSettings();
          setSettings(defaultSettings);
        }
        return;
      }

      // Mapear dados do Supabase para o formato esperado
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
        phone: data.phone || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        religiousMessage: data.religious_message || '',
        primaryIcon: data.primary_icon || '',
        secondaryIcon: data.secondary_icon || '',
        colors: {
          primary: data.primary_color,
          secondary: data.secondary_color,
          accent: data.accent_color
        }
      };

      setSettings(mappedSettings);
    } catch (error) {
      console.error('Error loading festival settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações do festival",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar configurações padrão
  const createDefaultSettings = async (): Promise<Settings> => {
    const defaultSettings = {
      name: 'Festa Comunitária',
      location: 'Centro Social Paróquia Santa Luzia',
      logoUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      theme: 'light',
      date: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '23:00',
      isActive: true,
      phone: '',
      title: '',
      subtitle: '',
      religiousMessage: '',
      primaryIcon: '',
      secondaryIcon: '',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#E0E7FF'
      }
    };

    try {
      const { data, error } = await supabase
        .from('festival_settings')
        .insert({
          name: defaultSettings.name,
          location: defaultSettings.location,
          logo_url: defaultSettings.logoUrl,
          primary_color: defaultSettings.primaryColor,
          secondary_color: defaultSettings.secondaryColor,
          accent_color: defaultSettings.colors.accent,
          theme: defaultSettings.theme,
          date: defaultSettings.date,
          start_time: defaultSettings.startTime,
          end_time: defaultSettings.endTime,
          is_active: defaultSettings.isActive,
          phone: defaultSettings.phone,
          title: defaultSettings.title,
          subtitle: defaultSettings.subtitle,
          religious_message: defaultSettings.religiousMessage,
          primary_icon: defaultSettings.primaryIcon,
          secondary_icon: defaultSettings.secondaryIcon
        })
        .select()
        .single();

      if (error) throw error;
      return defaultSettings;
    } catch (error) {
      console.error('Error creating default settings:', error);
      return defaultSettings;
    }
  };

  // Atualizar configurações
  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl;
      if (updates.primaryColor !== undefined) updateData.primary_color = updates.primaryColor;
      if (updates.secondaryColor !== undefined) updateData.secondary_color = updates.secondaryColor;
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
      if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.subtitle !== undefined) updateData.subtitle = updates.subtitle;
      if (updates.religiousMessage !== undefined) updateData.religious_message = updates.religiousMessage;
      if (updates.primaryIcon !== undefined) updateData.primary_icon = updates.primaryIcon;
      if (updates.secondaryIcon !== undefined) updateData.secondary_icon = updates.secondaryIcon;
      if (updates.colors?.accent !== undefined) updateData.accent_color = updates.colors.accent;

      const { error } = await supabase
        .from('festival_settings')
        .update(updateData)
        .eq('id', settings?.name || 'default'); // Usar um identificador válido

      if (error) throw error;

      // Recarregar configurações
      await loadSettings();

      toast({
        title: "Sucesso!",
        description: "Configurações atualizadas com sucesso"
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações",
        variant: "destructive"
      });
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
    updateSettings
  };
};
