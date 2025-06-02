import React, { createContext, useContext, useEffect, useState } from 'react';
import { Participant, Transaction, Product, Booth, ClosingOption } from '../types';
import { Settings } from '@/types/settings';
import { generateUUID } from '@/utils/idGeneration';

interface AppContextType {
  // Data
  participants: Participant[];
  transactions: Transaction[];
  products: Product[];
  booths: Booth[];
  closingOptions: ClosingOption[];
  settings: Settings | null;
  
  // Actions
  addParticipant: (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => void;
  updateParticipant: (id: string, updates: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;
  getParticipantByCard: (cardNumber: string) => Participant | undefined;
  
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addBooth: (booth: Omit<Booth, 'id' | 'totalSales'>) => void;
  updateBooth: (id: string, updates: Partial<Booth>) => void;
  deleteBooth: (id: string) => void;
  
  addClosingOption: (option: ClosingOption) => void;
  
  saveSettings: (newSettings: Partial<Settings>) => void;
  
  clearAllData: () => void;
  
  // Computed
  getTotalSales: () => number;
  getTotalActiveBalance: () => number;
  isFestivalActive: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const defaultSettings: Settings = {
  name: 'Festa Comunitária',
  location: 'Centro Social',
  logoUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  theme: 'light',
  date: new Date().toISOString().split('T')[0],
  startTime: '18:00',
  endTime: '23:00',
  isActive: true,
  phone: '',
  title: 'Festa Comunitária',
  subtitle: 'Sistema de Gestão',
  religiousMessage: '',
  primaryIcon: '',
  secondaryIcon: '',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#E0E7FF',
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [closingOptions, setClosingOptions] = useState<ClosingOption[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedParticipants = localStorage.getItem('festa-participants');
        if (savedParticipants) setParticipants(JSON.parse(savedParticipants));

        const savedTransactions = localStorage.getItem('festa-transactions');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

        const savedProducts = localStorage.getItem('festa-products');
        if (savedProducts) setProducts(JSON.parse(savedProducts));

        const savedBooths = localStorage.getItem('festa-booths');
        if (savedBooths) setBooths(JSON.parse(savedBooths));

        const savedClosingOptions = localStorage.getItem('festa-closing-options');
        if (savedClosingOptions) setClosingOptions(JSON.parse(savedClosingOptions));

        const savedSettings = localStorage.getItem('festa-settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('festa-participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('festa-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('festa-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('festa-booths', JSON.stringify(booths));
  }, [booths]);

  useEffect(() => {
    localStorage.setItem('festa-closing-options', JSON.stringify(closingOptions));
  }, [closingOptions]);

  useEffect(() => {
    localStorage.setItem('festa-settings', JSON.stringify(settings));
  }, [settings]);

  // Participant functions
  const addParticipant = (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: generateUUID(),
      qrCode: participant.cardNumber,
      createdAt: new Date().toISOString()
    };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const getParticipantByCard = (cardNumber: string): Participant | undefined => {
    return participants.find(p => p.cardNumber === cardNumber);
  };

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateUUID(),
      timestamp: new Date().toISOString()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    // Update participant balance
    updateParticipant(transaction.participantId, {
      balance: participants.find(p => p.id === transaction.participantId)!.balance + 
              (transaction.type === 'credit' ? transaction.amount : -transaction.amount)
    });
    
    // Update booth sales if it's a debit transaction
    if (transaction.type === 'debit' && transaction.booth) {
      const booth = booths.find(b => b.name === transaction.booth);
      if (booth) {
        updateBooth(booth.id, { totalSales: booth.totalSales + transaction.amount });
      }
    }
  };

  // Product functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: generateUUID()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Booth functions
  const addBooth = (booth: Omit<Booth, 'id' | 'totalSales'>) => {
    const newBooth: Booth = {
      ...booth,
      id: generateUUID(),
      totalSales: 0
    };
    setBooths(prev => [...prev, newBooth]);
  };

  const updateBooth = (id: string, updates: Partial<Booth>) => {
    setBooths(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBooth = (id: string) => {
    setBooths(prev => prev.filter(b => b.id !== id));
  };

  // Closing options
  const addClosingOption = (option: ClosingOption) => {
    setClosingOptions(prev => [...prev, option]);
  };

  // Settings
  const saveSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Clear all data function
  const clearAllData = () => {
    setParticipants([]);
    setTransactions([]);
    setProducts([]);
    setBooths([]);
    setClosingOptions([]);
    
    // Clear localStorage
    localStorage.removeItem('festa-participants');
    localStorage.removeItem('festa-transactions');
    localStorage.removeItem('festa-products');
    localStorage.removeItem('festa-booths');
    localStorage.removeItem('festa-closing-options');
  };

  // Computed values
  const getTotalSales = (): number => {
    return transactions
      .filter(t => t.type === 'debit')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalActiveBalance = (): number => {
    return participants
      .filter(p => p.isActive)
      .reduce((total, p) => total + p.balance, 0);
  };

  const isFestivalActive = (): boolean => {
    if (!settings?.isActive) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (today !== settings.date) return false;
    if (currentTime < settings.startTime) return false;
    if (currentTime > settings.endTime) return false;
    
    return true;
  };

  const value: AppContextType = {
    participants,
    transactions,
    products,
    booths,
    closingOptions,
    settings,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    getParticipantByCard,
    addTransaction,
    addProduct,
    updateProduct,
    deleteProduct,
    addBooth,
    updateBooth,
    deleteBooth,
    addClosingOption,
    saveSettings,
    clearAllData,
    getTotalSales,
    getTotalActiveBalance,
    isFestivalActive
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
