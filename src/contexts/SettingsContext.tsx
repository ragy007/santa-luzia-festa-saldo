import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Settings, UserAccount, Booth } from '@/types/settings';

interface SettingsContextType {
  settings: Settings;
  users: UserAccount[];
  booths: Booth[];
  updateSettings: (settings: Partial<Settings>) => void;
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;
  addBooth: (booth: Omit<Booth, 'id'>) => void;
  updateBooth: (id: string, booth: Partial<Booth>) => void;
  deleteBooth: (id: string) => void;
  isFestivalActive: () => boolean;
}

type Action =
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_USERS'; payload: UserAccount[] }
  | { type: 'ADD_USER'; payload: UserAccount }
  | { type: 'UPDATE_USER'; payload: { id: string; user: Partial<UserAccount> } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_BOOTHS'; payload: Booth[] }
  | { type: 'ADD_BOOTH'; payload: Booth }
  | { type: 'UPDATE_BOOTH'; payload: { id: string; booth: Partial<Booth> } }
  | { type: 'DELETE_BOOTH'; payload: string };

const defaultSettings: Settings = {
  name: 'Festa Comunitária',
  location: 'Centro Social Paróquia Santa Luzia',
  logoUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  theme: 'light',
  date: new Date().toISOString().split('T')[0],
  startTime: '18:00',
  endTime: '23:00',
  isActive: true,
  phone: '',
  title: 'Festa Comunitária 2024',
  subtitle: 'Centro Social da Paróquia Santa Luzia',
  religiousMessage: '',
};

// Dados padrão que sempre devem existir
const defaultUsers: UserAccount[] = [
  {
    id: 'admin-default',
    email: 'admin@festa.com',
    password: '123456',
    name: 'Administrador',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

const defaultBooths: Booth[] = [
  {
    id: 'booth-default',
    name: 'Barraca Principal',
    description: 'Barraca principal da festa',
    isActive: true,
  }
];

const initialState = {
  settings: defaultSettings,
  users: defaultUsers,
  booths: defaultBooths,
};

function settingsReducer(state: typeof initialState, action: Action): typeof initialState {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { 
        ...state, 
        users: [...state.users, action.payload] 
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.user }
            : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case 'SET_BOOTHS':
      return { ...state, booths: action.payload };
    case 'ADD_BOOTH':
      return { 
        ...state, 
        booths: [...state.booths, action.payload] 
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
    default:
      return state;
  }
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Função para garantir que os dados padrão sempre existam
const ensureDefaultData = (storedData: any) => {
  const result = { ...initialState };
  
  // Mesclar configurações
  if (storedData?.settings) {
    result.settings = { ...defaultSettings, ...storedData.settings };
  }
  
  // Garantir que o usuário admin padrão sempre exista
  if (storedData?.users && Array.isArray(storedData.users)) {
    const hasAdminDefault = storedData.users.some((user: UserAccount) => user.id === 'admin-default');
    result.users = hasAdminDefault ? storedData.users : [defaultUsers[0], ...storedData.users];
  }
  
  // Garantir que pelo menos uma barraca padrão exista
  if (storedData?.booths && Array.isArray(storedData.booths)) {
    const hasDefaultBooth = storedData.booths.some((booth: Booth) => booth.id === 'booth-default');
    result.booths = hasDefaultBooth ? storedData.booths : [defaultBooths[0], ...storedData.booths];
  }
  
  return result;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedSettings = localStorage.getItem('festa-settings');
        console.log('SettingsProvider - Loading stored data:', storedSettings);
        
        if (storedSettings) {
          const parsedData = JSON.parse(storedSettings);
          const dataWithDefaults = ensureDefaultData(parsedData);
          
          console.log('SettingsProvider - Data with defaults:', dataWithDefaults);
          
          dispatch({ type: 'SET_SETTINGS', payload: dataWithDefaults.settings });
          dispatch({ type: 'SET_USERS', payload: dataWithDefaults.users });
          dispatch({ type: 'SET_BOOTHS', payload: dataWithDefaults.booths });
        } else {
          console.log('SettingsProvider - No stored data, using defaults');
          // Se não há dados salvos, garantir que os padrões sejam salvos
          const dataToSave = {
            settings: defaultSettings,
            users: defaultUsers,
            booths: defaultBooths,
          };
          localStorage.setItem('festa-settings', JSON.stringify(dataToSave));
        }
      } catch (error) {
        console.error('SettingsProvider - Error loading data:', error);
        // Em caso de erro, usar dados padrão
        dispatch({ type: 'SET_SETTINGS', payload: defaultSettings });
        dispatch({ type: 'SET_USERS', payload: defaultUsers });
        dispatch({ type: 'SET_BOOTHS', payload: defaultBooths });
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const dataToSave = {
      settings: state.settings,
      users: state.users,
      booths: state.booths,
    };
    console.log('SettingsProvider - Saving data:', dataToSave);
    localStorage.setItem('festa-settings', JSON.stringify(dataToSave));
  }, [state]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const addUser = (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
  };

  const updateUser = (id: string, user: Partial<UserAccount>) => {
    dispatch({ type: 'UPDATE_USER', payload: { id, user } });
  };

  const deleteUser = (id: string) => {
    // Não permitir deletar o usuário admin padrão
    if (id === 'admin-default') {
      console.warn('Cannot delete default admin user');
      return;
    }
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const addBooth = (booth: Omit<Booth, 'id'>) => {
    const newBooth: Booth = {
      ...booth,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_BOOTH', payload: newBooth });
  };

  const updateBooth = (id: string, booth: Partial<Booth>) => {
    dispatch({ type: 'UPDATE_BOOTH', payload: { id, booth } });
  };

  const deleteBooth = (id: string) => {
    // Não permitir deletar a barraca padrão se for a única
    if (id === 'booth-default' && state.booths.length === 1) {
      console.warn('Cannot delete the last booth');
      return;
    }
    dispatch({ type: 'DELETE_BOOTH', payload: id });
  };

  const isFestivalActive = () => {
    if (!state.settings.isActive) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (today !== state.settings.date) return false;
    if (currentTime < state.settings.startTime) return false;
    if (currentTime > state.settings.endTime) return false;
    
    return true;
  };

  const value = {
    settings: state.settings,
    users: state.users,
    booths: state.booths,
    updateSettings,
    addUser,
    updateUser,
    deleteUser,
    addBooth,
    updateBooth,
    deleteBooth,
    isFestivalActive,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
