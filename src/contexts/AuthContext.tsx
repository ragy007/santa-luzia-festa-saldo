
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

// Credenciais válidas do sistema
const validCredentials = [
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
          // Verificar se é um usuário válido do sistema
          const validUser = validCredentials.find(cred => cred.email === session.user.email);
          if (validUser) {
            const defaultProfile: Profile = {
              id: session.user.id,
              full_name: validUser.name,
              role: validUser.role
            };
            setProfile(defaultProfile);
          } else {
            // Usuário não autorizado
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
            const validUser = validCredentials.find(cred => cred.email === session.user.email);
            if (validUser) {
              const defaultProfile: Profile = {
                id: session.user.id,
                full_name: validUser.name,
                role: validUser.role
              };
              setProfile(defaultProfile);
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
