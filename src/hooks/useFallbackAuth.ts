
import { supabase } from '@/integrations/supabase/client';

interface FallbackCredential {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
}

const fallbackCredentials: FallbackCredential[] = [
  { email: 'admin@festa.com', password: '123456', name: 'Administrador', role: 'admin' },
  { email: 'operador@festa.com', password: '123456', name: 'Operador 1', role: 'operator' },
  { email: 'operador2@festa.com', password: '123456', name: 'Operador 2', role: 'operator' },
  { email: 'operador3@festa.com', password: '123456', name: 'Operador 3', role: 'operator' }
];

export const useFallbackAuth = () => {
  const signInWithCredentials = async (email: string, password: string) => {
    try {
      // Primeiro tentar com Supabase normalmente
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Se falhar, verificar se é uma credencial de fallback
        const fallbackUser = fallbackCredentials.find(
          cred => cred.email === email && cred.password === password
        );

        if (fallbackUser) {
          // Tentar criar usuário no Supabase se não existir
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError && !signUpError.message.includes('already registered')) {
            throw signUpError;
          }

          // Tentar fazer login novamente
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (retryError) {
            throw retryError;
          }

          return { data: retryData, error: null };
        }

        throw error;
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const getFallbackCredentials = () => fallbackCredentials;

  return {
    signInWithCredentials,
    getFallbackCredentials
  };
};
