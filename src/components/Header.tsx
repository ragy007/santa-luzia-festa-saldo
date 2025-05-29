
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { settings } = useSettings();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        {settings.logoUrl && (
          <img 
            src={settings.logoUrl} 
            alt="Logo" 
            className="h-8 w-8 object-contain"
          />
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            🎉 {settings.name}
          </h1>
          <p className="text-sm text-gray-600">
            {settings.location} • {new Date(settings.date).toLocaleDateString('pt-BR')}
            {settings.phone && ` • ${settings.phone}`}
          </p>
        </div>
        {profile && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            profile.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {profile.role === 'admin' ? 'Administrador' : 'Operador'}
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{profile?.full_name || 'Usuário'}</span>
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
  );
};

export default Header;
