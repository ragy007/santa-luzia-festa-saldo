
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
        setError('Email ou senha incorretos. Verifique as credenciais e tente novamente.');
        return;
      }

      console.log('User account found:', userAccount.email, userAccount.role);

      // Tentar fazer login primeiro
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Sign in attempt:', { signInData, signInError });

      if (signInError) {
        // Se o erro for de credenciais inválidas, tentar criar o usuário
        if (signInError.message === 'Invalid login credentials') {
          console.log('User not found in Auth, attempting to create...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
              data: {
                full_name: userAccount.name,
                role: userAccount.role
              },
              emailRedirectTo: undefined // Evitar confirmação por email
            }
          });

          console.log('Sign up attempt:', { signUpData, signUpError });

          if (signUpError) {
            console.error('Sign up error:', signUpError);
            setError('Erro ao criar conta de usuário. Tente novamente.');
            return;
          }

          if (signUpData.user) {
            // Se o usuário foi criado mas precisa de confirmação, tentar login novamente
            if (!signUpData.session) {
              console.log('User created but needs confirmation, trying login again...');
              
              // Aguardar um pouco e tentar login novamente
              setTimeout(async () => {
                const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                  email: credentials.email,
                  password: credentials.password,
                });

                if (retryError) {
                  console.error('Retry login error:', retryError);
                  setError('Usuário criado, mas erro no login. Tente novamente em alguns segundos.');
                } else if (retryData.user) {
                  console.log('Login successful after retry:', retryData.user.email);
                  toast({
                    title: "Login realizado!",
                    description: "Bem-vindo ao sistema!",
                  });
                }
                setLoading(false);
              }, 1000);
              return;
            } else {
              console.log('User created and signed in:', signUpData.user.email);
              toast({
                title: "Login realizado!",
                description: "Bem-vindo ao sistema!",
              });
            }
          }
        } else {
          console.error('Other auth error:', signInError);
          setError('Erro de autenticação: ' + signInError.message);
        }
        return;
      }

      if (signInData.user) {
        console.log('User signed in successfully:', signInData.user.email);
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
