
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'operator';
  booth_id?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
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

// Credenciais de fallback
const fallbackCredentials = [
  { email: 'admin@festa.com', password: '123456', name: 'Administrador', role: 'admin' as const },
  { email: 'operador@festa.com', password: '123456', name: 'Operador 1', role: 'operator' as const },
  { email: 'operador2@festa.com', password: '123456', name: 'Operador 2', role: 'operator' as const },
  { email: 'operador3@festa.com', password: '123456', name: 'Operador 3', role: 'operator' as const }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para validar usuário
  const validateUser = async (email: string): Promise<Profile | null> => {
    // Primeiro tentar no banco
    try {
      const { data: userAccount, error } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && userAccount) {
        return {
          id: userAccount.id,
          full_name: userAccount.name,
          role: userAccount.role as 'admin' | 'operator',
          booth_id: userAccount.booth_id
        };
      }
    } catch (error) {
      console.log('Erro ao buscar no banco, usando fallback');
    }

    // Fallback para credenciais hardcoded
    const fallbackUser = fallbackCredentials.find(cred => cred.email === email);
    if (fallbackUser) {
      return {
        id: email,
        full_name: fallbackUser.name,
        role: fallbackUser.role
      };
    }

    return null;
  };

  useEffect(() => {
    console.log('Inicializando AuthProvider...');
    
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userProfile = await validateUser(session.user.email || '');
          if (userProfile) {
            setSession(session);
            setUser(session.user);
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    // Configurar listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && event !== 'SIGNED_OUT') {
          const userProfile = await validateUser(session.user.email || '');
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isOperator = profile?.role === 'operator';

  const value = {
    user,
    profile,
    session,
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
