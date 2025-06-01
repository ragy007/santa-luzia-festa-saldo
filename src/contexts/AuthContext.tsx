
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

  const loadProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create default
          console.log('Creating default profile...');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              full_name: 'Usuário',
              role: 'operator'
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating profile:', insertError);
            return null;
          }
          return newProfile;
        }
        return null;
      }

      return profileData;
    } catch (error) {
      console.error('Profile load error:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth listener...');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && event !== 'SIGNED_OUT') {
          const profileData = await loadProfile(session.user.id);
          if (profileData) {
            const mappedProfile: Profile = {
              id: profileData.id,
              full_name: profileData.full_name,
              role: profileData.role as 'admin' | 'operator',
              booth_id: profileData.booth_id
            };
            setProfile(mappedProfile);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        console.log('Initial session check:', session?.user?.email || 'no session');
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
