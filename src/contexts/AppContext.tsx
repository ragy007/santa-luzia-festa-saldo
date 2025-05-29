import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Participant, Transaction, Product, Booth, ClosingOption } from '../types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface AppContextType extends AppState {
  addParticipant: (participant: Omit<Participant, 'id' | 'createdAt' | 'qrCode'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  addBooth: (booth: Omit<Booth, 'id' | 'totalSales'>) => Promise<void>;
  updateParticipantBalance: (participantId: string, amount: number, type: 'credit' | 'debit') => void;
  getParticipantByCard: (cardNumber: string) => Participant | undefined;
  getParticipantTransactions: (participantId: string) => Transaction[];
  addClosingOption: (closingOption: Omit<ClosingOption, 'timestamp'>) => void;
  getTotalSales: () => number;
  getTotalActiveBalance: () => number;
  generateQRCode: (cardNumber: string) => string;
  refreshProducts: () => Promise<void>;
  refreshBooths: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>({
    participants: [],
    transactions: [],
    products: [],
    booths: [],
    closingOptions: [],
    festivalActive: true,
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Carregar dados do localStorage primeiro (dados locais)
  useEffect(() => {
    const savedData = localStorage.getItem('paroquia-festa-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setState(prevState => ({ 
          ...prevState, 
          participants: parsedData.participants || [],
          transactions: parsedData.transactions || [],
          closingOptions: parsedData.closingOptions || []
        }));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
    setDataLoaded(true);
  }, []);

  // Carregar dados do Supabase apenas quando necessário e usuário autenticado
  useEffect(() => {
    if (user && dataLoaded) {
      const loadSupabaseData = async () => {
        await Promise.all([fetchBooths(), fetchProducts()]);
      };
      loadSupabaseData();
    }
  }, [user, dataLoaded]);

  // Salvar dados no localStorage (debounced)
  useEffect(() => {
    if (!dataLoaded) return;
    
    const timeoutId = setTimeout(() => {
      const dataToSave = {
        participants: state.participants,
        transactions: state.transactions,
        closingOptions: state.closingOptions
      };
      localStorage.setItem('paroquia-festa-data', JSON.stringify(dataToSave));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state.participants, state.transactions, state.closingOptions, dataLoaded]);

  const fetchBooths = async () => {
    try {
      const { data, error } = await supabase
        .from('booths')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar barracas:', error);
        return;
      }

      const boothsData: Booth[] = data.map(booth => ({
        id: booth.id,
        name: booth.name,
        isActive: booth.is_active,
        totalSales: 0
      }));

      setState(prev => ({ ...prev, booths: boothsData }));
    } catch (error) {
      console.error('Erro ao buscar barracas:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          is_active,
          booths!inner (
            name
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        return;
      }

      const productsData: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        booth: product.booths.name,
        isActive: product.is_active
      }));

      setState(prev => ({ ...prev, products: productsData }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const generateQRCode = (cardNumber: string) => {
    return `PAROQUIA_SANTA_LUZIA_${cardNumber}`;
  };

  const addParticipant = (participant: Omit<Participant, 'id' | 'createdAt' | 'qrCode'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: generateId(),
      createdAt: new Date().toISOString(),
      qrCode: generateQRCode(participant.cardNumber),
    };

    setState(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));

    if (participant.initialBalance > 0) {
      addTransaction({
        participantId: newParticipant.id,
        type: 'credit',
        amount: participant.initialBalance,
        description: 'Carga inicial',
        operatorName: 'Sistema',
      });
    }

    toast({
      title: "Participante cadastrado!",
      description: `${participant.name} foi cadastrado com sucesso.`,
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));

    updateParticipantBalance(transaction.participantId, transaction.amount, transaction.type);

    if (transaction.type === 'debit' && transaction.booth) {
      setState(prev => ({
        ...prev,
        booths: prev.booths.map(booth =>
          booth.name === transaction.booth
            ? { ...booth, totalSales: booth.totalSales + transaction.amount }
            : booth
        ),
      }));
    }
  };

  const updateParticipantBalance = (participantId: string, amount: number, type: 'credit' | 'debit') => {
    setState(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.id === participantId
          ? {
              ...p,
              balance: type === 'credit' ? p.balance + amount : p.balance - amount,
            }
          : p
      ),
    }));
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data: boothData, error: boothError } = await supabase
        .from('booths')
        .select('id')
        .eq('name', product.booth)
        .single();

      if (boothError || !boothData) {
        toast({
          title: "Erro!",
          description: "Barraca não encontrada.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
          booth_id: boothData.id,
          is_active: product.isActive
        });

      if (error) {
        console.error('Erro ao adicionar produto:', error);
        toast({
          title: "Erro!",
          description: "Erro ao adicionar produto.",
          variant: "destructive",
        });
        return;
      }

      await fetchProducts();

      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao cardápio.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro!",
        description: "Erro ao adicionar produto.",
        variant: "destructive",
      });
    }
  };

  const addBooth = async (booth: Omit<Booth, 'id' | 'totalSales'>) => {
    try {
      const { error } = await supabase
        .from('booths')
        .insert({
          name: booth.name,
          is_active: booth.isActive
        });

      if (error) {
        console.error('Erro ao adicionar barraca:', error);
        toast({
          title: "Erro!",
          description: "Erro ao adicionar barraca.",
          variant: "destructive",
        });
        return;
      }

      await fetchBooths();

      toast({
        title: "Barraca adicionada!",
        description: `${booth.name} foi adicionada à festa.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar barraca:', error);
      toast({
        title: "Erro!",
        description: "Erro ao adicionar barraca.",
        variant: "destructive",
      });
    }
  };

  const getParticipantByCard = (cardNumber: string) => {
    return state.participants.find(p => p.cardNumber === cardNumber);
  };

  const getParticipantTransactions = (participantId: string) => {
    return state.transactions.filter(t => t.participantId === participantId);
  };

  const addClosingOption = (closingOption: Omit<ClosingOption, 'timestamp'>) => {
    const newClosingOption: ClosingOption = {
      ...closingOption,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      closingOptions: [...prev.closingOptions, newClosingOption],
    }));

    toast({
      title: "Encerramento registrado!",
      description: "Opção de encerramento foi registrada com sucesso.",
    });
  };

  const getTotalSales = () => {
    return state.transactions
      .filter(t => t.type === 'debit')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalActiveBalance = () => {
    return state.participants.reduce((total, p) => total + p.balance, 0);
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const refreshBooths = async () => {
    await fetchBooths();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addParticipant,
        addTransaction,
        addProduct,
        addBooth,
        updateParticipantBalance,
        getParticipantByCard,
        getParticipantTransactions,
        addClosingOption,
        getTotalSales,
        getTotalActiveBalance,
        generateQRCode,
        refreshProducts,
        refreshBooths,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
