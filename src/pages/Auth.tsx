
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
  const { user, profile } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user && profile) {
      console.log('User logged in, redirecting...', { user: user.email, role: profile.role });
      if (profile.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/consumo');
      }
    }
  }, [user, profile, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting sign in with:', credentials.email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Auth error:', error);
        
        if (error.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos. Tente usar as credenciais de teste disponíveis abaixo.');
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
        // O redirecionamento será feito pelo useEffect quando o profile for carregado
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
