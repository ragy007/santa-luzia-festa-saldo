
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface TestCredentialsProps {
  onCredentialSelect: (email: string, password: string) => void;
}

const TestCredentials: React.FC<TestCredentialsProps> = ({ onCredentialSelect }) => {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4" />
      <AlertDescription className="text-blue-600">
        <strong>Credenciais de teste:</strong><br />
        <div className="mt-2 space-y-1">
          <button 
            type="button"
            onClick={() => onCredentialSelect('admin@festa.com', '123456')}
            className="block text-left hover:bg-blue-100 p-2 rounded w-full text-sm border border-blue-200"
          >
            <strong>👑 Admin:</strong> admin@festa.com / 123456
          </button>
          <button 
            type="button"
            onClick={() => onCredentialSelect('operador@festa.com', '123456')}
            className="block text-left hover:bg-blue-100 p-2 rounded w-full text-sm border border-blue-200"
          >
            <strong>👤 Operador:</strong> operador@festa.com / 123456
          </button>
        </div>
        <div className="mt-2 text-xs text-blue-500">
          Clique em uma das opções acima para preencher automaticamente
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TestCredentials;
