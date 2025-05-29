
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

const QRCodeInfo: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <QrCode className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">QR Code Automático</h3>
            <p className="text-sm text-green-700">
              Cada cartão recebe automaticamente um QR Code único para facilitar a leitura
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeInfo;
