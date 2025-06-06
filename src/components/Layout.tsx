
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/LocalAuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  UserPlus, 
  ShoppingCart, 
  DollarSign, 
  Eye,
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Wifi,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const handleChangeUser = () => {
    signOut();
    navigate('/login');
  };

  // Diferentes navegações para admin e operador
  const adminNavigationItems = [
    { path: '/', icon: Home, label: 'Dashboard', adminOnly: false },
    { path: '/cadastro', icon: UserPlus, label: 'Cadastro', adminOnly: false },
    { path: '/consumo', icon: ShoppingCart, label: 'Consumo', adminOnly: false },
    { path: '/recarga', icon: DollarSign, label: 'Recarga', adminOnly: false },
    { path: '/consulta-saldo', icon: Eye, label: 'Consulta Saldo', adminOnly: false },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios', adminOnly: true },
    { path: '/encerramento', icon: UserCheck, label: 'Encerramento', adminOnly: false },
    { path: '/settings', icon: Settings, label: 'Configurações', adminOnly: true },
    { path: '/sincronizacao', icon: Wifi, label: 'Sincronização', adminOnly: false },
  ];

  const operatorNavigationItems = [
    { path: '/consumo', icon: ShoppingCart, label: 'Consumo', adminOnly: false },
    { path: '/consulta-saldo', icon: Eye, label: 'Consulta Saldo', adminOnly: false },
    { path: '/sincronizacao', icon: Wifi, label: 'Sincronização', adminOnly: false },
  ];

  // Escolher navegação baseada no papel do usuário
  const navigationItems = isAdmin ? adminNavigationItems : operatorNavigationItems;

  const filteredNavigation = navigationItems.filter(item => 
    !item.adminOnly || isAdmin
  );

  const currentPath = location.pathname;

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'block md:hidden' : 'hidden md:block'} w-64 bg-white shadow-lg h-full`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-800">🎪 Sistema Festa</h1>
          {mobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => mobile && setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Operador'}</p>
          {user?.boothName && (
            <p className="text-xs text-blue-600">{user.boothName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleChangeUser}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Mudar Usuário
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <Sidebar />
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar Mobile */}
        <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-gray-800">{title}</h1>
          <div className="w-10" />
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
