
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDataMigration = () => {
  const migrateFromLocalStorage = async () => {
    try {
      // Carregar dados do localStorage
      const storedSettings = localStorage.getItem('festa-settings');
      const storedAppState = localStorage.getItem('appState');

      if (!storedSettings && !storedAppState) {
        toast({
          title: "Aviso",
          description: "Nenhum dado encontrado no localStorage para migrar",
        });
        return;
      }

      let settingsData = null;
      let usersData = null;
      let boothsData = null;
      let participantsData = null;
      let productsData = null;
      let transactionsData = null;

      // Parse dados das configurações
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        settingsData = parsedSettings.settings;
        usersData = parsedSettings.users;
        boothsData = parsedSettings.booths;
      }

      // Parse dados do estado da aplicação
      if (storedAppState) {
        const parsedAppState = JSON.parse(storedAppState);
        participantsData = parsedAppState.participants;
        productsData = parsedAppState.products;
        transactionsData = parsedAppState.transactions;
        
        // Se não temos booths das configurações, pegar do app state
        if (!boothsData && parsedAppState.booths) {
          boothsData = parsedAppState.booths;
        }
      }

      // Migrar configurações manualmente
      if (settingsData) {
        const { error: settingsError } = await supabase
          .from('festival_settings')
          .upsert({
            name: settingsData.name || 'Festa Comunitária',
            location: settingsData.location || 'Centro Social',
            logo_url: settingsData.logoUrl,
            primary_color: settingsData.primaryColor || '#3B82F6',
            secondary_color: settingsData.secondaryColor || '#10B981',
            accent_color: settingsData.colors?.accent || '#E0E7FF',
            theme: settingsData.theme || 'light',
            date: settingsData.date || new Date().toISOString().split('T')[0],
            start_time: settingsData.startTime || '18:00',
            end_time: settingsData.endTime || '23:00',
            is_active: settingsData.isActive ?? true,
            phone: settingsData.phone,
            title: settingsData.title,
            subtitle: settingsData.subtitle,
            religious_message: settingsData.religiousMessage,
            primary_icon: settingsData.primaryIcon,
            secondary_icon: settingsData.secondaryIcon,
          });

        if (settingsError) throw settingsError;
      }

      // Migrar usuários
      if (usersData && Array.isArray(usersData)) {
        for (const user of usersData) {
          const { error } = await supabase
            .from('user_accounts')
            .upsert({
              id: user.id,
              email: user.email,
              password: user.password,
              name: user.name,
              role: user.role,
              booth_id: user.boothId,
              is_active: user.isActive ?? true,
              created_at: user.createdAt || new Date().toISOString(),
            });

          if (error && error.code !== '23505') { // Ignorar erro de duplicação
            console.error('Erro ao migrar usuário:', error);
          }
        }
      }

      // Migrar barracas
      if (boothsData && Array.isArray(boothsData)) {
        for (const booth of boothsData) {
          const { error } = await supabase
            .from('festival_booths')
            .upsert({
              id: booth.id,
              name: booth.name,
              description: booth.description,
              is_active: booth.isActive ?? true,
              total_sales: booth.totalSales || 0,
            });

          if (error) {
            console.error('Erro ao migrar barraca:', error);
          }
        }
      }

      // Migrar participantes
      if (participantsData && Array.isArray(participantsData)) {
        for (const participant of participantsData) {
          const { error } = await supabase
            .from('participants')
            .upsert({
              id: participant.id,
              name: participant.name,
              card_number: participant.cardNumber,
              qr_code: participant.qrCode,
              balance: participant.balance || 0,
              initial_balance: participant.initialBalance || 0,
              phone: participant.phone,
              is_active: participant.isActive ?? true,
              created_at: participant.createdAt || new Date().toISOString(),
            });

          if (error) {
            console.error('Erro ao migrar participante:', error);
          }
        }
      }

      // Migrar produtos
      if (productsData && Array.isArray(productsData)) {
        for (const product of productsData) {
          const { error } = await supabase
            .from('festival_products')
            .upsert({
              id: product.id,
              name: product.name,
              price: product.price,
              booth: product.booth,
              is_active: product.isActive ?? true,
              is_free: product.isFree || false,
            });

          if (error) {
            console.error('Erro ao migrar produto:', error);
          }
        }
      }

      // Migrar transações
      if (transactionsData && Array.isArray(transactionsData)) {
        for (const transaction of transactionsData) {
          const { error } = await supabase
            .from('transactions')
            .upsert({
              id: transaction.id,
              participant_id: transaction.participantId,
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              booth: transaction.booth,
              operator_name: transaction.operatorName,
              created_at: transaction.timestamp || new Date().toISOString(),
            });

          if (error) {
            console.error('Erro ao migrar transação:', error);
          }
        }
      }

      toast({
        title: "Migração concluída!",
        description: "Dados migrados com sucesso para o banco de dados",
      });

      // Opcional: fazer backup do localStorage antes de limpar
      const backupData = {
        settings: storedSettings,
        appState: storedAppState,
        migratedAt: new Date().toISOString()
      };
      localStorage.setItem('festa-backup', JSON.stringify(backupData));

      // Limpar localStorage após migração bem-sucedida
      localStorage.removeItem('festa-settings');
      localStorage.removeItem('appState');

      toast({
        title: "Limpeza concluída",
        description: "Dados locais foram limpos. Um backup foi salvo.",
      });

      return true;
    } catch (error) {
      console.error('Erro na migração:', error);
      toast({
        title: "Erro na migração",
        description: "Erro ao migrar dados para o banco de dados",
        variant: "destructive"
      });
      throw error;
    }
  };

  const restoreFromBackup = async () => {
    try {
      const backup = localStorage.getItem('festa-backup');
      if (!backup) {
        toast({
          title: "Aviso",
          description: "Nenhum backup encontrado",
        });
        return;
      }

      const backupData = JSON.parse(backup);
      
      if (backupData.settings) {
        localStorage.setItem('festa-settings', backupData.settings);
      }
      
      if (backupData.appState) {
        localStorage.setItem('appState', backupData.appState);
      }

      toast({
        title: "Backup restaurado",
        description: "Dados foram restaurados do backup",
      });

      // Recarregar página para aplicar dados restaurados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao restaurar backup",
        variant: "destructive"
      });
    }
  };

  return {
    migrateFromLocalStorage,
    restoreFromBackup
  };
};
