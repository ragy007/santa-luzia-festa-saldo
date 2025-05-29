
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Participant } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar participantes do Supabase
  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedParticipants: Participant[] = data.map(p => ({
        id: p.id,
        name: p.name,
        cardNumber: p.card_number,
        qrCode: p.qr_code,
        balance: Number(p.balance),
        initialBalance: Number(p.initial_balance),
        phone: p.phone,
        isActive: p.is_active,
        createdAt: p.created_at
      }));

      setParticipants(mappedParticipants);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar participantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar participante
  const addParticipant = async (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .insert({
          name: participant.name,
          card_number: participant.cardNumber,
          qr_code: participant.cardNumber,
          balance: participant.balance,
          initial_balance: participant.initialBalance,
          phone: participant.phone,
          is_active: participant.isActive
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Participante cadastrado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar participante",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar participante
  const updateParticipant = async (id: string, updates: Partial<Participant>) => {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.cardNumber !== undefined) updateData.card_number = updates.cardNumber;
      if (updates.balance !== undefined) updateData.balance = updates.balance;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { error } = await supabase
        .from('participants')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar participante:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar participante",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar participante
  const deleteParticipant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar participante:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar participante",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Buscar participante por cartão
  const getParticipantByCard = (cardNumber: string): Participant | undefined => {
    return participants.find(p => p.cardNumber === cardNumber);
  };

  // Configurar realtime
  useEffect(() => {
    loadParticipants();

    const channel = supabase
      .channel('participants-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'participants' }, 
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    participants,
    loading,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    getParticipantByCard
  };
};
