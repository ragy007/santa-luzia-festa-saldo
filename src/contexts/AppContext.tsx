
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Participant, Transaction, Product, Booth, ClosingOption } from '../types';

interface AppContextType {
  state: AppState;
  participants: Participant[];
  transactions: Transaction[];
  products: Product[];
  booths: Booth[];
  closingOptions: ClosingOption[];
  addParticipant: (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => void;
  updateParticipant: (id: string, participant: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBooth: (booth: Omit<Booth, 'id' | 'totalSales'>) => Booth;
  updateBooth: (id: string, booth: Partial<Booth>) => void;
  deleteBooth: (id: string) => void;
  addClosingOption: (option: Omit<ClosingOption, 'timestamp'>) => void;
  toggleFestival: () => void;
  clearAllData: () => void;
  getParticipantByCard: (cardNumber: string) => Participant | undefined;
  getTotalSales: () => number;
  getTotalActiveBalance: () => number;
}

type Action =
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'UPDATE_PARTICIPANT'; payload: { id: string; participant: Partial<Participant> } }
  | { type: 'DELETE_PARTICIPANT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; product: Partial<Product> } }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_BOOTH'; payload: Booth }
  | { type: 'UPDATE_BOOTH'; payload: { id: string; booth: Partial<Booth> } }
  | { type: 'DELETE_BOOTH'; payload: string }
  | { type: 'ADD_CLOSING_OPTION'; payload: ClosingOption }
  | { type: 'TOGGLE_FESTIVAL' }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  participants: [],
  transactions: [],
  products: [],
  booths: [],
  closingOptions: [],
  festivalActive: true,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };
    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map(participant =>
          participant.id === action.payload.id
            ? { ...participant, ...action.payload.participant }
            : participant
        ),
      };
    case 'DELETE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(participant => participant.id !== action.payload),
      };
    case 'ADD_TRANSACTION':
      const newTransaction = action.payload;
      console.log('Processing transaction:', newTransaction);
      
      const updatedParticipants = state.participants.map(participant => {
        if (participant.id === newTransaction.participantId) {
          let newBalance;
          if (newTransaction.type === 'credit') {
            // Recarga - adiciona saldo
            newBalance = participant.balance + newTransaction.amount;
            console.log(`Credit: ${participant.balance} + ${newTransaction.amount} = ${newBalance}`);
          } else {
            // Compra - subtrai saldo
            newBalance = participant.balance - newTransaction.amount;
            console.log(`Debit: ${participant.balance} - ${newTransaction.amount} = ${newBalance}`);
          }
          return { ...participant, balance: newBalance };
        }
        return participant;
      });

      const updatedBooths = state.booths.map(booth => {
        if (newTransaction.type === 'debit' && newTransaction.booth === booth.name) {
          const newTotalSales = booth.totalSales + newTransaction.amount;
          console.log(`Booth ${booth.name} sales: ${booth.totalSales} + ${newTransaction.amount} = ${newTotalSales}`);
          return { ...booth, totalSales: newTotalSales };
        }
        return booth;
      });

      return {
        ...state,
        transactions: [...state.transactions, newTransaction],
        participants: updatedParticipants,
        booths: updatedBooths,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.product }
            : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'ADD_BOOTH':
      return {
        ...state,
        booths: [...state.booths, action.payload],
      };
      
    case 'UPDATE_BOOTH':
      return {
        ...state,
        booths: state.booths.map(booth =>
          booth.id === action.payload.id
            ? { ...booth, ...action.payload.booth }
            : booth
        ),
      };
      
    case 'DELETE_BOOTH':
      return {
        ...state,
        booths: state.booths.filter(booth => booth.id !== action.payload),
      };
    case 'ADD_CLOSING_OPTION':
      return {
        ...state,
        closingOptions: [...state.closingOptions, action.payload],
      };
    case 'TOGGLE_FESTIVAL':
      return {
        ...state,
        festivalActive: !state.festivalActive,
      };
    case 'CLEAR_ALL_DATA':
      return initialState;
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const storedState = localStorage.getItem('appState');
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  const addParticipant = (participant: Omit<Participant, 'id' | 'qrCode' | 'createdAt'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: Math.random().toString(36).substr(2, 9),
      qrCode: participant.cardNumber,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PARTICIPANT', payload: newParticipant });
  };

  const updateParticipant = (id: string, participant: Partial<Participant>) => {
    dispatch({ type: 'UPDATE_PARTICIPANT', payload: { id, participant } });
  };

  const deleteParticipant = (id: string) => {
    dispatch({ type: 'DELETE_PARTICIPANT', payload: id });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    console.log('Adding transaction:', transaction);
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    console.log('New transaction created:', newTransaction);
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, product } });
  };

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  const addBooth = (booth: Omit<Booth, 'id' | 'totalSales'>): Booth => {
    const newBooth: Booth = {
      ...booth,
      id: Math.random().toString(36).substr(2, 9),
      totalSales: 0,
    };
    dispatch({ type: 'ADD_BOOTH', payload: newBooth });
    return newBooth;
  };

  const updateBooth = (id: string, booth: Partial<Booth>) => {
    dispatch({ type: 'UPDATE_BOOTH', payload: { id, booth } });
  };

  const deleteBooth = (id: string) => {
    dispatch({ type: 'DELETE_BOOTH', payload: id });
  };

  const addClosingOption = (option: Omit<ClosingOption, 'timestamp'>) => {
    const newOption: ClosingOption = {
      ...option,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CLOSING_OPTION', payload: newOption });
  };

  const toggleFestival = () => {
    dispatch({ type: 'TOGGLE_FESTIVAL' });
  };

  const clearAllData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  const getParticipantByCard = (cardNumber: string): Participant | undefined => {
    return state.participants.find(p => p.cardNumber === cardNumber);
  };

  const getTotalSales = (): number => {
    return state.transactions
      .filter(t => t.type === 'debit')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalActiveBalance = (): number => {
    return state.participants
      .filter(p => p.isActive)
      .reduce((total, p) => total + p.balance, 0);
  };

  const value = {
    state,
    participants: state.participants,
    transactions: state.transactions,
    products: state.products,
    booths: state.booths,
    closingOptions: state.closingOptions,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    addTransaction,
    addProduct,
    updateProduct,
    deleteProduct,
    addBooth,
    updateBooth,
    deleteBooth,
    addClosingOption,
    toggleFestival,
    clearAllData,
    getParticipantByCard,
    getTotalSales,
    getTotalActiveBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
