
import React from 'react';
import { Church } from 'lucide-react';

const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
          <Church className="h-8 w-8 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Sistema de Festa
      </h1>
      <p className="text-gray-600">
        Gestão de Participantes
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Sistema de Gestão
      </p>
    </div>
  );
};

export default AuthHeader;
