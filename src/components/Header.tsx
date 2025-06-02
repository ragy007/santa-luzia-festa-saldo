
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/LocalAuthContext';
import { useApp } from '@/contexts/LocalAppContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { settings } = useApp();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        {settings?.logoUrl && (
          <img 
            src={settings.logoUrl} 
            alt="Logo" 
            className="h-8 w-8 object-contain"
          />
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            🎉 {settings?.name || 'Festa Comunitária'}
          </h1>
          <p className="text-sm text-gray-600">
            {settings?.location || 'Centro Social'} • {new Date(settings?.date || new Date()).toLocaleDateString('pt-BR')}
            {settings?.phone && ` • ${settings.phone}`}
          </p>
        </div>
        {user && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {user.role === 'admin' ? 'Administrador' : 'Operador'}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{formatDateTime(currentDateTime)}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{user?.name || user?.email || 'Usuário'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
