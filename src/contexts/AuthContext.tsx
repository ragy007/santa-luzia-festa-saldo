
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
    
    // Configure Supabase client properly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && event !== 'SIGNED_OUT') {
          console.log('Loading profile for user:', session.user.id);
          // Load profile for authenticated user
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            console.log('Profile query result:', { profileData, error });

            if (error) {
              console.error('Error loading profile:', error);
              
              // If profile doesn't exist, create a default one
              if (error.code === 'PGRST116') {
                console.log('Profile not found, creating default profile...');
                const { data: newProfile, error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || session.user.email || 'Usuário',
                    role: 'operator'
                  })
                  .select()
                  .single();

                if (insertError) {
                  console.error('Error creating profile:', insertError);
                  setProfile(null);
                } else {
                  console.log('Profile created successfully:', newProfile);
                  const mappedProfile: Profile = {
                    id: newProfile.id,
                    full_name: newProfile.full_name,
                    role: newProfile.role as 'admin' | 'operator',
                    booth_id: newProfile.booth_id
                  };
                  setProfile(mappedProfile);
                }
              } else {
                setProfile(null);
              }
            } else if (profileData) {
              console.log('Profile loaded successfully:', profileData);
              const mappedProfile: Profile = {
                id: profileData.id,
                full_name: profileData.full_name,
                role: profileData.role as 'admin' | 'operator',
                booth_id: profileData.booth_id
              };
              setProfile(mappedProfile);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          }
        } else {
          console.log('No user session, clearing profile');
          setProfile(null);
        }
        
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Check current session
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
        
        console.log('Initial session check:', session?.user?.email || 'no session');
        
        if (isMounted && !session) {
          // No session found, stop loading
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
      console.log('Signing out...');
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) console.error('Sign out error:', error);
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      console.log('Signed out successfully');
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
