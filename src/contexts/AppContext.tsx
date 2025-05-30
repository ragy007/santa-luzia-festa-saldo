
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Participant, Transaction, Product, Booth, ClosingOption } from '@/types';
import { useParticipants } from '@/hooks/useParticipants';
import { useTransactions } from '@/hooks/useTransactions';
import { useFestivalProducts } from '@/hooks/useFestivalProducts';
import { useFestivalBooths } from '@/hooks/useFestivalBooths';

interface AppContextType extends AppState {
  loading: boolean;
  addParticipant: (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => Promise<void>;
  updateParticipant: (id: string, updates: Partial<Participant>) => Promise<void>;
  deleteParticipant: (id: string) => Promise<void>;
  getParticipantByCard: (cardNumber: string) => Participant | undefined;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
  getTotalSales: () => number;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addClosingOption: (option: ClosingOption) => void;
  updateClosingOption: (participantId: string, option: Partial<ClosingOption>) => void;
  getClosingOption: (participantId: string) => ClosingOption | undefined;
  setFestivalActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Reducer para gerenciar estado local
type AppAction = 
  | { type: 'SET_FESTIVAL_ACTIVE'; payload: boolean }
  | { type: 'ADD_CLOSING_OPTION'; payload: ClosingOption }
  | { type: 'UPDATE_CLOSING_OPTION'; payload: { participantId: string; option: Partial<ClosingOption> } };

const appReducer = (state: { festivalActive: boolean; closingOptions: ClosingOption[] }, action: AppAction) => {
  switch (action.type) {
    case 'SET_FESTIVAL_ACTIVE':
      return { ...state, festivalActive: action.payload };
    case 'ADD_CLOSING_OPTION':
      return { 
        ...state, 
        closingOptions: [...state.closingOptions.filter(o => o.participantId !== action.payload.participantId), action.payload] 
      };
    case 'UPDATE_CLOSING_OPTION':
      return {
        ...state,
        closingOptions: state.closingOptions.map(option =>
          option.participantId === action.payload.participantId
            ? { ...option, ...action.payload.option }
            : option
        )
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [localState, dispatch] = useReducer(appReducer, {
    festivalActive: true,
    closingOptions: []
  });

  // Hooks para dados do Supabase
  const { 
    participants, 
    loading: participantsLoading,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    getParticipantByCard
  } = useParticipants();

  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
    getTotalSales
  } = useTransactions();

  const {
    products,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useFestivalProducts();

  const { booths, loading: boothsLoading } = useFestivalBooths();

  const loading = participantsLoading || transactionsLoading || productsLoading || boothsLoading;

  // Funções para closing options (mantidas no estado local por enquanto)
  const addClosingOption = (option: ClosingOption) => {
    dispatch({ type: 'ADD_CLOSING_OPTION', payload: option });
  };

  const updateClosingOption = (participantId: string, option: Partial<ClosingOption>) => {
    dispatch({ type: 'UPDATE_CLOSING_OPTION', payload: { participantId, option } });
  };

  const getClosingOption = (participantId: string): ClosingOption | undefined => {
    return localState.closingOptions.find(option => option.participantId === participantId);
  };

  const setFestivalActive = (active: boolean) => {
    dispatch({ type: 'SET_FESTIVAL_ACTIVE', payload: active });
  };

  const value: AppContextType = {
    participants,
    transactions,
    products,
    booths,
    closingOptions: localState.closingOptions,
    festivalActive: localState.festivalActive,
    loading,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    getParticipantByCard,
    addTransaction,
    getTotalSales,
    addProduct,
    updateProduct,
    deleteProduct,
    addClosingOption,
    updateClosingOption,
    getClosingOption,
    setFestivalActive
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
