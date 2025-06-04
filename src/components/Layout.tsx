
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/LocalAuthContext';
import { useApp } from '../contexts/LocalAppContext';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  CreditCard,
  ShoppingCart,
  Eye,
  BarChart3,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  FileText,
  Clock
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: Home,
      description: 'Visão geral do sistema'
    },
    { 
      name: 'Cadastro', 
      path: '/cadastro', 
      icon: Users,
      description: 'Registrar participantes'
    },
    { 
      name: 'Recarga', 
      path: '/recarga', 
      icon: CreditCard,
      description: 'Adicionar créditos'
    },
    { 
      name: 'Consumo', 
      path: '/consumo', 
      icon: ShoppingCart,
      description: 'Registrar vendas'
    },
    { 
      name: 'Consultar Saldo', 
      path: '/consultar-saldo', 
      icon: Eye,
      description: 'Ver saldo e histórico'
    },
    { 
      name: 'Histórico', 
      path: '/historico', 
      icon: History,
      description: 'Todas as transações'
    },
    { 
      name: 'Relatórios', 
      path: '/relatorios', 
      icon: BarChart3,
      description: 'Vendas e estatísticas'
    },
    { 
      name: 'Encerramento', 
      path: '/encerramento', 
      icon: Clock,
      description: 'Fechar festa'
    },
  ];

  const adminItems = [
    { 
      name: 'Configurações', 
      path: '/settings', 
      icon: Settings,
      description: 'Configurar sistema'
    },
    { 
      name: 'Guia de Uso', 
      path: '/guia-uso', 
      icon: BookOpen,
      description: 'Como usar o sistema'
    },
    { 
      name: 'Documentação', 
      path: '/documentacao', 
      icon: FileText,
      description: 'Documentação completa'
    },
  ];

  const isCurrentPath = (path: string) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {settings?.title || 'Sistema de Festa'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {settings?.subtitle || 'Gestão de Cartões'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Main Menu */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
            Menu Principal
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                isCurrentPath(item.path)
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isCurrentPath(item.path) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
              )} />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Admin Menu */}
        {user?.role === 'admin' && (
          <div className="space-y-1 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-3">
              Administração
            </p>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                  isCurrentPath(item.path)
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isCurrentPath(item.path) ? "text-purple-500" : "text-gray-400 group-hover:text-gray-500"
                )} />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        {sidebarContent}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-80">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
