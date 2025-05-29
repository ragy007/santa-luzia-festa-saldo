
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar transações do Supabase
  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTransactions: Transaction[] = data.map(t => ({
        id: t.id,
        participantId: t.participant_id,
        type: t.type as 'credit' | 'debit',
        amount: Number(t.amount),
        description: t.description,
        booth: t.booth,
        operatorName: t.operator_name,
        timestamp: t.created_at
      }));

      setTransactions(mappedTransactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar transações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar transação
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      // Primeiro, criar a transação
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          participant_id: transaction.participantId,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          booth: transaction.booth,
          operator_name: transaction.operatorName
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Atualizar saldo do participante
      if (transaction.type === 'credit') {
        // Recarga - adicionar saldo
        const { error: updateError } = await supabase.rpc('update_participant_balance', {
          participant_id: transaction.participantId,
          amount_change: transaction.amount
        });
        if (updateError) throw updateError;
      } else {
        // Compra - subtrair saldo
        const { error: updateError } = await supabase.rpc('update_participant_balance', {
          participant_id: transaction.participantId,
          amount_change: -transaction.amount
        });
        if (updateError) throw updateError;

        // Atualizar vendas da barraca se for uma compra
        if (transaction.booth) {
          const { error: boothError } = await supabase.rpc('update_booth_sales', {
            booth_name: transaction.booth,
            amount_change: transaction.amount
          });
          if (boothError) throw boothError;
        }
      }

      return transactionData;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar transação",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getTotalSales = (): number => {
    return transactions
      .filter(t => t.type === 'debit')
      .reduce((total, t) => total + t.amount, 0);
  };

  // Configurar realtime
  useEffect(() => {
    loadTransactions();

    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => {
          loadTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    getTotalSales
  };
};
