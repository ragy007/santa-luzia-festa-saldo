
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: 'admin@festa.com',
    password: '123456'
  });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  // Clean up auth state utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && profile) {
      console.log('User logged in, redirecting...', { user: user.email, role: profile.role });
      
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
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('No active session to sign out');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Auth error:', error);
        
        if (error.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos. Use as credenciais de teste ou crie uma nova conta.');
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
        // The redirection will be handled by useEffect
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError('Erro inesperado ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setError(error.message || 'Erro ao criar conta');
        return;
      }

      if (data.user) {
        toast({
          title: "Conta criada!",
          description: "Sua conta foi criada com sucesso. Você já pode fazer login.",
        });
        
        // Clear signup form
        setSignupData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        });
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError('Erro inesperado ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCredentials = (email: string, password: string) => {
    setCredentials({ email, password });
    setError(null);
  };

  // Show loading while verifying authentication
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
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <TestCredentials onCredentialSelect={handleTestCredentials} />

                <LoginForm
                  credentials={credentials}
                  loading={loading}
                  onCredentialsChange={setCredentials}
                  onSubmit={handleSignIn}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signupPassword">Senha</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme sua senha"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && <AuthError error={error} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
