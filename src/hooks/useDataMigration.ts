
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

      // Chamar função do Supabase para migrar dados
      const { data, error } = await supabase.rpc('migrate_local_storage_data', {
        settings_data: settingsData,
        users_data: usersData,
        booths_data: boothsData,
        participants_data: participantsData,
        products_data: productsData,
        transactions_data: transactionsData
      });

      if (error) throw error;

      console.log('Migração concluída:', data);

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

      return data;
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
