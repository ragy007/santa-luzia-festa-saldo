
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import { 
  Home, 
  UserPlus, 
  CreditCard, 
  ShoppingCart, 
  History, 
  BarChart3, 
  Settings,
  LogOut,
  Heart,
  Church
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const allMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-600', adminOnly: true },
    { path: '/cadastro', icon: UserPlus, label: 'Cadastro', color: 'text-green-600', adminOnly: true },
    { path: '/recarga', icon: CreditCard, label: 'Recarga', color: 'text-yellow-600', adminOnly: true },
    { path: '/consumo', icon: ShoppingCart, label: 'Consumo', color: 'text-orange-600', adminOnly: false },
    { path: '/historico', icon: History, label: 'Histórico', color: 'text-purple-600', adminOnly: true },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios', color: 'text-indigo-600', adminOnly: true },
    { path: '/encerramento', icon: Settings, label: 'Encerramento', color: 'text-red-600', adminOnly: true },
    { path: '/settings', icon: Settings, label: 'Configurações', color: 'text-gray-600', adminOnly: true },
  ];

  // Filtrar menu baseado no role do usuário
  const menuItems = allMenuItems.filter(item => {
    if (profile?.role === 'admin') return true;
    return !item.adminOnly;
  });

  const handleSignOut = async () => {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      await signOut();
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const IconComponent = item.icon;
                  
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start h-12 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <IconComponent className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  );
                })}
                
                {/* Botão de Sair */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-12 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span className="font-medium">Sair</span>
                  </Button>
                </div>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <div className="p-6">
                {children}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
