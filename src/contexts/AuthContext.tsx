
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './SettingsContext';
import { UserAccount } from '@/types/settings';

interface AuthContextType {
  user: UserAccount | null;
  profile: UserAccount | null;
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const { users } = useSettings();

  useEffect(() => {
    console.log('AuthProvider - Users changed:', users);
    
    // Verificar se há usuário logado no localStorage
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('auth-user');
        console.log('AuthProvider - Stored user:', storedUser);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthProvider - Parsed user data:', userData);
          
          // Verificar se o usuário ainda existe na lista de usuários ativos
          const currentUser = users.find(u => 
            u.id === userData.id && 
            u.email === userData.email && 
            u.isActive
          );
          
          console.log('AuthProvider - Current user found:', currentUser);
          
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Usuário foi removido ou desativado, fazer logout
            console.log('AuthProvider - User not found or inactive, clearing auth');
            localStorage.removeItem('auth-user');
            setUser(null);
          }
        } else {
          console.log('AuthProvider - No stored user found');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('auth-user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Aguardar um pouco para garantir que os usuários foram carregados
    if (users.length > 0) {
      checkAuthStatus();
    } else {
      // Se ainda não há usuários, aguardar mais um pouco
      setTimeout(checkAuthStatus, 100);
    }

    // Escutar mudanças no localStorage
    const handleStorageChange = () => {
      console.log('AuthProvider - Storage changed, rechecking auth');
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [users]);

  const signOut = async () => {
    try {
      console.log('AuthProvider - Signing out');
      localStorage.removeItem('auth-user');
      setUser(null);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operator';

  console.log('AuthProvider - Current state:', { user, loading, isAdmin, isOperator });

  const value = {
    user,
    profile: user, // Para compatibilidade com o código existente
    session: user ? { user } : null, // Para compatibilidade
    loading,
    signOut,
    isAdmin,
    isOperator
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
