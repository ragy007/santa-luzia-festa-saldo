
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AuthHeader from '@/components/auth/AuthHeader';
import TestCredentials from '@/components/auth/TestCredentials';
import LoginForm from '@/components/auth/LoginForm';
import AuthError from '@/components/auth/AuthError';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: 'admin@festa.com',
    password: '123456'
  });
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && user && profile) {
      console.log('User logged in, redirecting...', { user: user.email, role: profile.role });
      
      // Redirecionamento baseado no role
      if (profile.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/consumo', { replace: true });
      }
    }
  }, [user, profile, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting sign in with:', credentials.email);

    try {
      // Primeiro, verificar se o usuário existe na tabela user_accounts
      const { data: userAccount, error: userError } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('email', credentials.email)
        .eq('password', credentials.password)
        .eq('is_active', true)
        .single();

      if (userError || !userAccount) {
        console.error('User account error:', userError);
        setError('Email ou senha incorretos. Tente usar as credenciais de teste disponíveis abaixo.');
        return;
      }

      // Se o usuário existe na tabela, fazer login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Auth error:', error);
        
        // Se o usuário não existe no Supabase Auth, tentar criar
        if (error.message === 'Invalid login credentials') {
          console.log('User not found in Auth, attempting to create...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                full_name: userAccount.name,
                role: userAccount.role
              }
            }
          });

          if (signUpError) {
            console.error('Sign up error:', signUpError);
            setError('Erro ao criar conta. Tente novamente.');
            return;
          }

          if (signUpData.user) {
            console.log('User created and signed in:', signUpData.user.email);
            toast({
              title: "Login realizado!",
              description: "Bem-vindo ao sistema!",
            });
            // O redirecionamento será feito pelo useEffect
          }
        } else {
          setError(error.message || 'Erro ao fazer login. Tente novamente.');
        }
        return;
      }

      if (data.user) {
        console.log('User signed in successfully:', data.user.email);
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao sistema!",
        });
        // O redirecionamento será feito pelo useEffect
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError('Erro inesperado ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCredentials = (email: string, password: string) => {
    setCredentials({ email, password });
    setError(null);
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <TestCredentials onCredentialSelect={handleTestCredentials} />

            <LoginForm
              credentials={credentials}
              loading={loading}
              onCredentialsChange={setCredentials}
              onSubmit={handleSignIn}
            />

            {error && <AuthError error={error} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
