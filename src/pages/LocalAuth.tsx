
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/LocalAuthContext';
import { toast } from '@/hooks/use-toast';

const LocalAuth: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: 'admin@festa.com',
    password: '123456'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/consumo', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(credentials.email, credentials.password);
      
      if (result.success) {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo ao sistema!",
        });
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Email ou senha incorretos",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testCredentials = [
    { email: 'admin@festa.com', password: '123456', name: 'Administrador', role: 'admin' },
    { email: 'operador@festa.com', password: '123456', name: 'Operador 1', role: 'operator' },
    { email: 'operador2@festa.com', password: '123456', name: 'Operador 2', role: 'operator' },
    { email: 'operador3@festa.com', password: '123456', name: 'Operador 3', role: 'operator' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Festa Comunitária</h1>
          <p className="text-gray-600">Sistema de Gestão Local</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Credenciais de Teste:</h3>
              <div className="space-y-2">
                {testCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => setCredentials({ email: cred.email, password: cred.password })}
                    className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border"
                  >
                    <div className="font-medium">{cred.name}</div>
                    <div className="text-gray-600">{cred.email} / {cred.password}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Digite seu email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💾 Sistema Local</h4>
              <p className="text-sm text-blue-800">
                Todos os dados são salvos localmente no seu navegador. 
                Não há necessidade de conexão com internet após o carregamento inicial.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocalAuth;
