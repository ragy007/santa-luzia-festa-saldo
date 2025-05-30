
import React from 'react';
import { Church } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const AuthHeader: React.FC = () => {
  const { settings, loading } = useSettings();

  // Exibir loading enquanto carrega as configurações
  if (loading) {
    return (
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
            <Church className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Usar valores padrão se settings for null
  const displayName = settings?.name || 'Festa Comunitária';
  const displayLocation = settings?.location || 'Centro Social';
  const logoUrl = settings?.logoUrl;

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-8 w-8 object-contain"
            />
          ) : (
            <Church className="h-8 w-8 text-white" />
          )}
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {displayName}
      </h1>
      <p className="text-gray-600">
        {displayLocation}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Sistema de Gestão
      </p>
    </div>
  );
};

export default AuthHeader;
