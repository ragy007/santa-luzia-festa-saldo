
import { useFestivalSettings } from './useFestivalSettings';
import { useUserAccounts } from './useUserAccounts';
import { useFestivalBooths } from './useFestivalBooths';
import { useFestivalProducts } from './useFestivalProducts';
import { useParticipants } from './useParticipants';
import { useTransactions } from './useTransactions';

export const useSupabaseData = () => {
  const settings = useFestivalSettings();
  const users = useUserAccounts();
  const booths = useFestivalBooths();
  const products = useFestivalProducts();
  const participants = useParticipants();
  const transactions = useTransactions();

  const loading = settings.loading || users.loading || booths.loading || 
                 products.loading || participants.loading || transactions.loading;

  return {
    settings: settings.settings,
    users: users.users,
    booths: booths.booths,
    products: products.products,
    participants: participants.participants,
    transactions: transactions.transactions,
    loading,
    // Actions
    saveSettings: settings.saveSettings,
    addUser: users.addUser,
    updateUser: users.updateUser,
    deleteUser: users.deleteUser,
    addBooth: booths.addBooth,
    updateBooth: booths.updateBooth,
    deleteBooth: booths.deleteBooth,
    addProduct: products.addProduct,
    updateProduct: products.updateProduct,
    deleteProduct: products.deleteProduct,
    addParticipant: participants.addParticipant,
    updateParticipant: participants.updateParticipant,
    deleteParticipant: participants.deleteParticipant,
    addTransaction: transactions.addTransaction,
    getParticipantByCard: participants.getParticipantByCard,
    getTotalSales: transactions.getTotalSales
  };
};
