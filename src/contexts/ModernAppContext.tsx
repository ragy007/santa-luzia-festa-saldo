
import React, { createContext, useContext } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Participant, Transaction, Product, Booth } from '../types';
import { Settings, UserAccount } from '@/types/settings';

interface ModernAppContextType {
  // Data
  settings: Settings | null;
  users: UserAccount[];
  booths: Booth[];
  products: Product[];
  participants: Participant[];
  transactions: Transaction[];
  loading: boolean;
  
  // Settings actions
  saveSettings: (settings: Partial<Settings>) => Promise<boolean>;
  
  // User actions
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => Promise<any>;
  updateUser: (id: string, user: Partial<UserAccount>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Booth actions
  addBooth: (booth: Omit<Booth, 'id' | 'totalSales'>) => Promise<any>;
  updateBooth: (id: string, booth: Partial<Booth>) => Promise<void>;
  deleteBooth: (id: string) => Promise<void>;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<any>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Participant actions
  addParticipant: (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => Promise<any>;
  updateParticipant: (id: string, participant: Partial<Participant>) => Promise<void>;
  deleteParticipant: (id: string) => Promise<void>;
  getParticipantByCard: (cardNumber: string) => Participant | undefined;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<any>;
  getTotalSales: () => number;
  
  // Legacy compatibility
  isFestivalActive: () => boolean;
  getTotalActiveBalance: () => number;
}

const ModernAppContext = createContext<ModernAppContextType | undefined>(undefined);

export const useModernApp = () => {
  const context = useContext(ModernAppContext);
  if (!context) {
    throw new Error('useModernApp must be used within a ModernAppProvider');
  }
  return context;
};

export const ModernAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseData = useSupabaseData();

  const isFestivalActive = () => {
    if (!supabaseData.settings?.isActive) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (today !== supabaseData.settings.date) return false;
    if (currentTime < supabaseData.settings.startTime) return false;
    if (currentTime > supabaseData.settings.endTime) return false;
    
    return true;
  };

  const getTotalActiveBalance = () => {
    return supabaseData.participants
      .filter(p => p.isActive)
      .reduce((total, p) => total + p.balance, 0);
  };

  const value: ModernAppContextType = {
    // Data
    settings: supabaseData.settings,
    users: supabaseData.users,
    booths: supabaseData.booths,
    products: supabaseData.products,
    participants: supabaseData.participants,
    transactions: supabaseData.transactions,
    loading: supabaseData.loading,
    
    // Actions
    saveSettings: supabaseData.saveSettings,
    addUser: supabaseData.addUser,
    updateUser: supabaseData.updateUser,
    deleteUser: supabaseData.deleteUser,
    addBooth: supabaseData.addBooth,
    updateBooth: supabaseData.updateBooth,
    deleteBooth: supabaseData.deleteBooth,
    addProduct: supabaseData.addProduct,
    updateProduct: supabaseData.updateProduct,
    deleteProduct: supabaseData.deleteProduct,
    addParticipant: supabaseData.addParticipant,
    updateParticipant: supabaseData.updateParticipant,
    deleteParticipant: supabaseData.deleteParticipant,
    getParticipantByCard: supabaseData.getParticipantByCard,
    addTransaction: supabaseData.addTransaction,
    getTotalSales: supabaseData.getTotalSales,
    
    // Legacy compatibility
    isFestivalActive,
    getTotalActiveBalance,
  };

  return (
    <ModernAppContext.Provider value={value}>
      {children}
    </ModernAppContext.Provider>
  );
};
