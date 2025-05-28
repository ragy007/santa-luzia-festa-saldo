
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  UserPlus, 
  CreditCard, 
  ShoppingCart, 
  History, 
  BarChart3, 
  Settings,
  Church
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/cadastro', icon: UserPlus, label: 'Cadastro', color: 'text-green-600' },
    { path: '/recarga', icon: CreditCard, label: 'Recarga', color: 'text-yellow-600' },
    { path: '/consumo', icon: ShoppingCart, label: 'Consumo', color: 'text-orange-600' },
    { path: '/historico', icon: History, label: 'Histórico', color: 'text-purple-600' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios', color: 'text-indigo-600' },
    { path: '/encerramento', icon: Settings, label: 'Encerramento', color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Church className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Centro Social Paróquia Santa Luzia</h1>
                <p className="text-sm text-gray-500">Sistema de Controle de Festa</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">Festa Comunitária 2024</p>
            </div>
          </div>
        </div>
      </div>

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
