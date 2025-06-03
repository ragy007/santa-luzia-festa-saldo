
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
  boothId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
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

// Credenciais padrão do sistema
const defaultCredentials = [
  { id: '1', email: 'admin@festa.com', password: '123456', name: 'Administrador', role: 'admin' as const },
  { id: '2', email: 'operador@festa.com', password: '123456', name: 'Operador 1', role: 'operator' as const, boothId: 'Barraca de Bebidas' },
  { id: '3', email: 'operador2@festa.com', password: '123456', name: 'Operador 2', role: 'operator' as const, boothId: 'Barraca de Comidas' },
  { id: '4', email: 'operador3@festa.com', password: '123456', name: 'Operador 3', role: 'operator' as const, boothId: 'Barraca de Doces' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar credenciais padrão se não existirem
    const existingUsers = localStorage.getItem('festa-users');
    if (!existingUsers) {
      localStorage.setItem('festa-users', JSON.stringify(defaultCredentials));
    }

    // Verificar se há usuário logado
    const currentUser = localStorage.getItem('festa-current-user');
    if (currentUser) {
      try {
        setUser(JSON.parse(currentUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('festa-current-user');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersData = localStorage.getItem('festa-users');
      const users = usersData ? JSON.parse(usersData) : defaultCredentials;
      
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          boothId: foundUser.boothId
        };
        
        setUser(userData);
        localStorage.setItem('festa-current-user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Email ou senha incorretos' };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('festa-current-user');
  };

  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operator';

  const value = {
    user,
    loading,
    signIn,
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
