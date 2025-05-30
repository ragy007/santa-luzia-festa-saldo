
import React from 'react';
import { Church } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const AuthHeader: React.FC = () => {
  const { settings } = useSettings();

  return (
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
  );
};

export default AuthHeader;
