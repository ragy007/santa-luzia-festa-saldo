
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserAccount } from '@/types/settings';
import { toast } from '@/hooks/use-toast';

export const useUserAccounts = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar usuários do Supabase
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedUsers: UserAccount[] = data.map(u => ({
        id: u.id,
        email: u.email,
        password: u.password,
        name: u.name,
        role: u.role as 'admin' | 'operator',
        boothId: u.booth_id,
        isActive: u.is_active,
        createdAt: u.created_at
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar usuário
  const addUser = async (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .insert({
          email: user.email,
          password: user.password,
          name: user.name,
          role: user.role,
          booth_id: user.boothId,
          is_active: user.isActive
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Usuário criado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar usuário
  const updateUser = async (id: string, updates: Partial<UserAccount>) => {
    try {
      const { error } = await supabase
        .from('user_accounts')
        .update({
          email: updates.email,
          password: updates.password,
          name: updates.name,
          role: updates.role,
          booth_id: updates.boothId,
          is_active: updates.isActive
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar usuário
  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar usuário",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Configurar realtime
  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel('user-accounts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_accounts' }, 
        () => {
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser
  };
};
