
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Participant, Transaction, Product, Booth, ClosingOption } from '../types';
import { toast } from '@/hooks/use-toast';

interface AppContextType extends AppState {
  addParticipant: (participant: Omit<Participant, 'id' | 'createdAt' | 'qrCode'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addBooth: (booth: Omit<Booth, 'id' | 'totalSales'>) => void;
  updateParticipantBalance: (participantId: string, amount: number, type: 'credit' | 'debit') => void;
  getParticipantByCard: (cardNumber: string) => Participant | undefined;
  getParticipantTransactions: (participantId: string) => Transaction[];
  addClosingOption: (closingOption: Omit<ClosingOption, 'timestamp'>) => void;
  getTotalSales: () => number;
  getTotalActiveBalance: () => number;
  generateQRCode: (cardNumber: string) => string;
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
  const [state, setState] = useState<AppState>({
    participants: [],
    transactions: [],
    products: [
      { id: '1', name: 'Refrigerante', price: 5.00, booth: 'Bebidas', isActive: true },
      { id: '2', name: 'Pastel', price: 8.00, booth: 'Comidas', isActive: true },
      { id: '3', name: 'Cerveja', price: 7.00, booth: 'Bebidas', isActive: true },
      { id: '4', name: 'Espetinho', price: 12.00, booth: 'Churrasco', isActive: true },
      { id: '5', name: 'Açaí', price: 10.00, booth: 'Sobremesas', isActive: true },
    ],
    booths: [
      { id: '1', name: 'Bebidas', isActive: true, totalSales: 0 },
      { id: '2', name: 'Comidas', isActive: true, totalSales: 0 },
      { id: '3', name: 'Churrasco', isActive: true, totalSales: 0 },
      { id: '4', name: 'Sobremesas', isActive: true, totalSales: 0 },
    ],
    closingOptions: [],
    festivalActive: true,
  });

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('paroquia-festa-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setState(prevState => ({ ...prevState, ...parsedData }));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('paroquia-festa-data', JSON.stringify(state));
  }, [state]);

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

    // Registrar transação inicial se houver saldo
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

    // Atualizar saldo do participante
    updateParticipantBalance(transaction.participantId, transaction.amount, transaction.type);

    // Atualizar total de vendas da barraca se for débito
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

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
    };

    setState(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao cardápio.`,
    });
  };

  const addBooth = (booth: Omit<Booth, 'id' | 'totalSales'>) => {
    const newBooth: Booth = {
      ...booth,
      id: generateId(),
      totalSales: 0,
    };

    setState(prev => ({
      ...prev,
      booths: [...prev.booths, newBooth],
    }));

    toast({
      title: "Barraca adicionada!",
      description: `${booth.name} foi adicionada à festa.`,
    });
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
