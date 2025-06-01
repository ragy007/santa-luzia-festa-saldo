
import React, { createContext, useContext } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface AppContextType {
  participants: any[];
  transactions: any[];
  products: any[];
  booths: any[];
  state: {
    participants: any[];
    transactions: any[];
    products: any[];
    booths: any[];
    closingOptions: any[];
    festivalActive: boolean;
  };
  addParticipant: (participant: any) => Promise<void>;
  updateParticipant: (id: string, participant: any) => Promise<void>;
  deleteParticipant: (id: string) => Promise<void>;
  addTransaction: (transaction: any) => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBooth: (booth: any) => Promise<any>;
  updateBooth: (id: string, booth: any) => Promise<void>;
  deleteBooth: (id: string) => Promise<void>;
  getParticipantByCard: (cardNumber: string) => any;
  getTotalSales: () => number;
  getTotalActiveBalance: () => number;
  clearAllData: () => void;
  addClosingOption: (option: any) => void;
  closingOptions: any[];
  loading: boolean;
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
  const supabaseData = useSupabaseData();

  const getParticipantByCard = (cardNumber: string) => {
    return supabaseData.participants?.find(p => p.cardNumber === cardNumber);
  };

  const getTotalActiveBalance = () => {
    return supabaseData.participants
      ?.filter(p => p.isActive)
      ?.reduce((total, p) => total + (Number(p.balance) || 0), 0) || 0;
  };

  const clearAllData = () => {
    console.log('Clear all data not implemented yet');
  };

  const addClosingOption = (option: any) => {
    console.log('Add closing option not implemented yet', option);
  };

  const wrappedAddParticipant = async (participant: any): Promise<void> => {
    await supabaseData.addParticipant(participant);
  };

  const wrappedAddTransaction = async (transaction: any): Promise<void> => {
    await supabaseData.addTransaction(transaction);
  };

  const wrappedAddProduct = async (product: any): Promise<void> => {
    await supabaseData.addProduct(product);
  };

  const value = {
    participants: supabaseData.participants || [],
    transactions: supabaseData.transactions || [],
    products: supabaseData.products || [],
    booths: supabaseData.booths || [],
    state: {
      participants: supabaseData.participants || [],
      transactions: supabaseData.transactions || [],
      products: supabaseData.products || [],
      booths: supabaseData.booths || [],
      closingOptions: [],
      festivalActive: true,
    },
    addParticipant: wrappedAddParticipant,
    updateParticipant: supabaseData.updateParticipant,
    deleteParticipant: supabaseData.deleteParticipant,
    addTransaction: wrappedAddTransaction,
    addProduct: wrappedAddProduct,
    updateProduct: supabaseData.updateProduct,
    deleteProduct: supabaseData.deleteProduct,
    addBooth: supabaseData.addBooth,
    updateBooth: supabaseData.updateBooth,
    deleteBooth: supabaseData.deleteBooth,
    getParticipantByCard,
    getTotalSales: supabaseData.getTotalSales,
    getTotalActiveBalance,
    clearAllData,
    addClosingOption,
    closingOptions: [],
    loading: supabaseData.loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
