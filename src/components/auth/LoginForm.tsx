
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  credentials: {
    email: string;
    password: string;
  };
  loading: boolean;
  onCredentialsChange: (credentials: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  credentials,
  loading,
  onCredentialsChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          required 
          placeholder="seu@email.com"
          value={credentials.email}
          onChange={(e) => onCredentialsChange({ ...credentials, email: e.target.value })}
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
          onChange={(e) => onCredentialsChange({ ...credentials, password: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
};

export default LoginForm;
