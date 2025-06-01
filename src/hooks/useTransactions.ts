
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types';
import { toast } from '@/hooks/use-toast';

// Input validation utility
const validateTransactionInput = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
  if (!transaction.participantId || typeof transaction.participantId !== 'string') {
    throw new Error('ID do participante é obrigatório');
  }
  
  if (!transaction.type || !['credit', 'debit'].includes(transaction.type)) {
    throw new Error('Tipo de transação inválido');
  }
  
  const amount = Number(transaction.amount);
  if (isNaN(amount) || amount <= 0 || amount > 10000) {
    throw new Error('Valor deve ser um número positivo até R$ 10.000');
  }
  
  if (!transaction.description || transaction.description.trim().length === 0) {
    throw new Error('Descrição é obrigatória');
  }
  
  if (transaction.description.length > 500) {
    throw new Error('Descrição muito longa (máximo 500 caracteres)');
  }
  
  if (!transaction.operatorName || transaction.operatorName.trim().length === 0) {
    throw new Error('Nome do operador é obrigatório');
  }
  
  // Sanitize inputs
  return {
    ...transaction,
    amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
    description: transaction.description.trim().slice(0, 500),
    operatorName: transaction.operatorName.trim().slice(0, 100),
    booth: transaction.booth ? transaction.booth.trim().slice(0, 100) : null
  };
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from Supabase
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

  // Add transaction with validation
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      // Validate and sanitize input
      const validatedTransaction = validateTransactionInput(transaction);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verify participant exists
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .select('id, balance')
        .eq('id', validatedTransaction.participantId)
        .single();

      if (participantError || !participant) {
        throw new Error('Participante não encontrado');
      }

      // For debit transactions, check if participant has sufficient balance
      if (validatedTransaction.type === 'debit') {
        const currentBalance = Number(participant.balance || 0);
        if (currentBalance < validatedTransaction.amount) {
          throw new Error('Saldo insuficiente');
        }
      }

      // Create the transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          participant_id: validatedTransaction.participantId,
          type: validatedTransaction.type,
          amount: validatedTransaction.amount,
          description: validatedTransaction.description,
          booth: validatedTransaction.booth,
          operator_name: validatedTransaction.operatorName
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update participant balance using RPC
      if (validatedTransaction.type === 'credit') {
        const { error: updateError } = await supabase.rpc('update_participant_balance' as any, {
          participant_id: validatedTransaction.participantId,
          amount_change: validatedTransaction.amount
        });
        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase.rpc('update_participant_balance' as any, {
          participant_id: validatedTransaction.participantId,
          amount_change: -validatedTransaction.amount
        });
        if (updateError) throw updateError;

        // Update booth sales if it's a purchase
        if (validatedTransaction.booth) {
          const { error: boothError } = await supabase.rpc('update_booth_sales' as any, {
            booth_name: validatedTransaction.booth,
            amount_change: validatedTransaction.amount
          });
          if (boothError) throw boothError;
        }
      }

      return transactionData;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar transação';
      toast({
        title: "Erro",
        description: errorMessage,
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

  // Configure realtime
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
