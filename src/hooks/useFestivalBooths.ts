
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booth } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useFestivalBooths = () => {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar barracas do Supabase
  const loadBooths = async () => {
    try {
      const { data, error } = await supabase
        .from('festival_booths')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedBooths: Booth[] = data.map(b => ({
        id: b.id,
        name: b.name,
        isActive: b.is_active,
        totalSales: Number(b.total_sales)
      }));

      setBooths(mappedBooths);
    } catch (error) {
      console.error('Erro ao carregar barracas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar barracas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar barraca
  const addBooth = async (booth: Omit<Booth, 'id' | 'totalSales'>) => {
    try {
      const { data, error } = await supabase
        .from('festival_booths')
        .insert({
          name: booth.name,
          is_active: booth.isActive
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Barraca adicionada com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar barraca:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar barraca",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar barraca
  const updateBooth = async (id: string, updates: Partial<Booth>) => {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { error } = await supabase
        .from('festival_booths')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar barraca:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar barraca",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar barraca
  const deleteBooth = async (id: string) => {
    try {
      const { error } = await supabase
        .from('festival_booths')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar barraca:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar barraca",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Configurar realtime
  useEffect(() => {
    loadBooths();

    const channel = supabase
      .channel('festival-booths-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'festival_booths' }, 
        () => {
          loadBooths();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    booths,
    loading,
    addBooth,
    updateBooth,
    deleteBooth
  };
};
