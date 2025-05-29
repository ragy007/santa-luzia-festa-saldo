
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FestivalSettings, UserAccount } from '@/types/settings';

interface SettingsContextType {
  settings: FestivalSettings;
  users: UserAccount[];
  updateSettings: (newSettings: Partial<FestivalSettings>) => void;
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<UserAccount>) => void;
  deleteUser: (userId: string) => void;
  applyThemeColors: (colors: FestivalSettings['colors']) => void;
}

const defaultSettings: FestivalSettings = {
  name: 'Festa Comunitária',
  date: new Date().toISOString().split('T')[0],
  location: 'Centro Social Paróquia Santa Luzia',
  title: 'Festa Comunitária 2024',
  subtitle: 'Centro Social da Paróquia Santa Luzia',
  religiousMessage: 'Sob a proteção de Santa Maria Auxiliadora e São João Bosco',
  colors: {
    primary: '#4F46E5',
    secondary: '#F8FAFC', 
    accent: '#E0E7FF'
  }
};

// Usuário administrador padrão
const defaultAdminUser: UserAccount = {
  id: 'admin-default',
  email: 'admin@festa.com',
  password: '123456',
  name: 'Administrador',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString()
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FestivalSettings>(defaultSettings);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('festival-settings');
    const savedUsers = localStorage.getItem('festival-users');
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }

    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        // Se não há usuários salvos, criar o usuário padrão
        if (parsedUsers.length === 0) {
          setUsers([defaultAdminUser]);
        } else {
          setUsers(parsedUsers);
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setUsers([defaultAdminUser]);
      }
    } else {
      // Se não há dados de usuários, criar o usuário padrão
      setUsers([defaultAdminUser]);
    }
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('festival-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('festival-users', JSON.stringify(users));
  }, [users]);

  const updateSettings = (newSettings: Partial<FestivalSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.colors) {
      applyThemeColors(newSettings.colors);
    }
  };

  const addUser = (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const applyThemeColors = (colors: FestivalSettings['colors']) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
  };

  // Aplicar cores do tema ao carregar
  useEffect(() => {
    applyThemeColors(settings.colors);
  }, [settings.colors]);

  return (
    <SettingsContext.Provider value={{
      settings,
      users,
      updateSettings,
      addUser,
      updateUser,
      deleteUser,
      applyThemeColors
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
