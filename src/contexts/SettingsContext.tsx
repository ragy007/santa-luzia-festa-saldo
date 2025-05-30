
import React, { createContext, useContext, ReactNode } from 'react';
import { Settings, Booth, UserAccount } from '@/types/settings';
import { useFestivalSettings } from '@/hooks/useFestivalSettings';
import { useFestivalBooths } from '@/hooks/useFestivalBooths';

interface SettingsContextType {
  settings: Settings | null;
  booths: Booth[];
  users: UserAccount[];
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  addBooth: (booth: Omit<Booth, 'id' | 'totalSales'>) => Promise<void>;
  updateBooth: (id: string, booth: Partial<Booth>) => Promise<void>;
  deleteBooth: (id: string) => Promise<void>;
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, user: Partial<UserAccount>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  loading: boolean;
  isFestivalActive: () => boolean;
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
  const { booths: rawBooths, loading: boothsLoading, addBooth: addBoothHook, updateBooth, deleteBooth } = useFestivalBooths();

  // Convert booths from index.ts type to settings.ts type
  const booths: Booth[] = rawBooths.map(booth => ({
    id: booth.id,
    name: booth.name,
    isActive: booth.isActive,
    totalSales: booth.totalSales
  }));

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

  const addBooth = async (booth: Omit<Booth, 'id' | 'totalSales'>) => {
    await addBoothHook(booth);
  };

  const isFestivalActive = (): boolean => {
    if (!settings) return false;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    return settings.isActive && 
           settings.date === today && 
           currentTime >= settings.startTime && 
           currentTime <= settings.endTime;
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
    loading,
    isFestivalActive
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
