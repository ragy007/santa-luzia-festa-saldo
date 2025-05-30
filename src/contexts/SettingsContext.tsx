
import React, { createContext, useContext, ReactNode } from 'react';
import { Settings, Booth, UserAccount } from '@/types/settings';
import { useFestivalSettings } from '@/hooks/useFestivalSettings';
import { useFestivalBooths } from '@/hooks/useFestivalBooths';

interface SettingsContextType {
  settings: Settings | null;
  booths: Booth[];
  users: UserAccount[];
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  addBooth: (booth: Omit<Booth, 'id'>) => Promise<void>;
  updateBooth: (id: string, booth: Partial<Booth>) => Promise<void>;
  deleteBooth: (id: string) => Promise<void>;
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, user: Partial<UserAccount>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings, loading: settingsLoading, updateSettings } = useFestivalSettings();
  const { booths, loading: boothsLoading, addBooth, updateBooth, deleteBooth } = useFestivalBooths();

  // Mock users para agora - será implementado com hooks específicos depois
  const users: UserAccount[] = [];
  const addUser = async (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    console.log('Add user:', user);
  };
  const updateUser = async (id: string, user: Partial<UserAccount>) => {
    console.log('Update user:', id, user);
  };
  const deleteUser = async (id: string) => {
    console.log('Delete user:', id);
  };

  const loading = settingsLoading || boothsLoading;

  const value = {
    settings,
    booths,
    users,
    updateSettings,
    addBooth,
    updateBooth,
    deleteBooth,
    addUser,
    updateUser,
    deleteUser,
    loading
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
