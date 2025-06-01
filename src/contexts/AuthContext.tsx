
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

// Credenciais de fallback (caso a tabela user_accounts esteja vazia)
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

  // Função para verificar credenciais no banco e fallback
  const validateUser = async (email: string): Promise<Profile | null> => {
    try {
      // Primeiro, tentar buscar na tabela user_accounts
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

      // Fallback para credenciais hardcoded
      const fallbackUser = fallbackCredentials.find(cred => cred.email === email);
      if (fallbackUser) {
        return {
          id: email, // Usar email como ID para fallback
          full_name: fallbackUser.name,
          role: fallbackUser.role
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      
      // Em caso de erro, usar fallback
      const fallbackUser = fallbackCredentials.find(cred => cred.email === email);
      if (fallbackUser) {
        return {
          id: email,
          full_name: fallbackUser.name,
          role: fallbackUser.role
        };
      }
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    console.log('Setting up auth state listener...');
    
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && event !== 'SIGNED_OUT') {
          // Validar usuário usando banco + fallback
          const userProfile = await validateUser(session.user.email || '');
          if (userProfile) {
            setProfile(userProfile);
            console.log('User validated:', userProfile.full_name, userProfile.role);
          } else {
            console.warn('Usuário não autorizado:', session.user.email);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('Current session:', session?.user?.email || 'no session');
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const userProfile = await validateUser(session.user.email || '');
            if (userProfile) {
              setProfile(userProfile);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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
