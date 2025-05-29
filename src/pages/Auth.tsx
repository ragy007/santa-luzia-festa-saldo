
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';
import { Church, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: 'admin@festa.com',
    password: '123456'
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, users } = useSettings();

  console.log('Auth component - Current user:', user);
  console.log('Auth component - Available users:', users);

  // Redirecionar se já estiver logado
  useEffect(() => {
    console.log('Auth useEffect - user:', user);
    if (user) {
      console.log('User found, redirecting to dashboard');
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Attempting login with:', credentials);
    console.log('Available users for comparison:', users);

    try {
      // Simular autenticação local
      const foundUser = users.find(u => {
        console.log('Checking user:', u.email, 'vs', credentials.email);
        console.log('Password check:', u.password, 'vs', credentials.password);
        console.log('Is active:', u.isActive);
        
        return u.email === credentials.email && 
               u.password === credentials.password &&
               u.isActive;
      });

      console.log('Found user:', foundUser);

      if (foundUser) {
        // Simular login bem-sucedido
        const authUser = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role
        };
        
        console.log('Setting auth user in localStorage:', authUser);
        localStorage.setItem('auth-user', JSON.stringify(authUser));
        
        toast({
          title: "Login realizado!",
          description: `Bem-vindo, ${foundUser.name}!`,
        });
        
        console.log('About to navigate to dashboard');
        
        // Forçar refresh do contexto de auth antes do redirecionamento
        window.dispatchEvent(new Event('storage'));
        
        // Usar setTimeout para garantir que o contexto seja atualizado
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        console.log('Login failed - user not found or invalid credentials');
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Encontrar usuários para mostrar as credenciais
  const adminUser = users.find(u => u.role === 'admin');
  const operatorUser = users.find(u => u.role === 'operator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <Church className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {settings.name}
          </h1>
          <p className="text-gray-600">
            {settings.location}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Sistema de Gestão
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-600">
                <strong>Credenciais disponíveis:</strong><br />
                {adminUser && (
                  <>
                    <strong>Admin:</strong> {adminUser.email} / {adminUser.password}<br />
                  </>
                )}
                {operatorUser && (
                  <>
                    <strong>Operador:</strong> {operatorUser.email} / {operatorUser.password}
                  </>
                )}
                {!operatorUser && !adminUser && (
                  <>Email: admin@festa.com / Senha: 123456</>
                )}
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  placeholder="seu@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  placeholder="Sua senha"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
