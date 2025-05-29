
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthErrorProps {
  error: string;
}

const AuthError: React.FC<AuthErrorProps> = ({ error }) => {
  return (
    <Alert className="mt-4 border-red-200 bg-red-50">
      <AlertDescription className="text-red-600">
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default AuthError;
