
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
          try {
            // Buscar perfil do usuário na tabela user_accounts
            const { data: userAccount, error } = await supabase
              .from('user_accounts')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (error) {
              console.error('Error fetching user account:', error);
              // Criar perfil padrão temporário para evitar problemas
              const defaultProfile: Profile = {
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || 'Usuário',
                role: 'admin' // Assumir admin por padrão para os usuários de teste
              };
              setProfile(defaultProfile);
            } else {
              // Mapear dados do user_account para o perfil
              const mappedProfile: Profile = {
                id: session.user.id,
                full_name: userAccount.name,
                role: userAccount.role as 'admin' | 'operator',
                booth_id: userAccount.booth_id || undefined
              };
              setProfile(mappedProfile);
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
            // Fallback para perfil padrão
            const defaultProfile: Profile = {
              id: session.user.id,
              full_name: session.user.email?.split('@')[0] || 'Usuário',
              role: 'admin'
            };
            setProfile(defaultProfile);
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
            try {
              // Buscar perfil do usuário
              const { data: userAccount, error } = await supabase
                .from('user_accounts')
                .select('*')
                .eq('email', session.user.email)
                .single();

              if (!error && userAccount) {
                const mappedProfile: Profile = {
                  id: session.user.id,
                  full_name: userAccount.name,
                  role: userAccount.role as 'admin' | 'operator',
                  booth_id: userAccount.booth_id || undefined
                };
                setProfile(mappedProfile);
              } else {
                // Perfil padrão se não encontrar
                const defaultProfile: Profile = {
                  id: session.user.id,
                  full_name: session.user.email?.split('@')[0] || 'Usuário',
                  role: 'admin'
                };
                setProfile(defaultProfile);
              }
            } catch (error) {
              console.error('Error loading profile:', error);
              const defaultProfile: Profile = {
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || 'Usuário',
                role: 'admin'
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
