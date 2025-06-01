
import React, { createContext, useContext } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface AppContextType {
  participants: any[];
  transactions: any[];
  products: any[];
  booths: any[];
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
    return supabaseData.participants?.find(p => p.card_number === cardNumber);
  };

  const getTotalActiveBalance = () => {
    return supabaseData.participants
      ?.filter(p => p.is_active)
      ?.reduce((total, p) => total + (p.balance || 0), 0) || 0;
  };

  const value = {
    participants: supabaseData.participants || [],
    transactions: supabaseData.transactions || [],
    products: supabaseData.products || [],
    booths: supabaseData.booths || [],
    addParticipant: supabaseData.addParticipant,
    updateParticipant: supabaseData.updateParticipant,
    deleteParticipant: supabaseData.deleteParticipant,
    addTransaction: supabaseData.addTransaction,
    addProduct: supabaseData.addProduct,
    updateProduct: supabaseData.updateProduct,
    deleteProduct: supabaseData.deleteProduct,
    addBooth: supabaseData.addBooth,
    updateBooth: supabaseData.updateBooth,
    deleteBooth: supabaseData.deleteBooth,
    getParticipantByCard,
    getTotalSales: supabaseData.getTotalSales,
    getTotalActiveBalance,
    loading: supabaseData.loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
