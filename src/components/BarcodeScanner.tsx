
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  isOpen: boolean;
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onScan, onClose }) => {
  const [barcodeInput, setBarcodeInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBarcodeInput('');
      
      // Focar no input quando abrir
      const timer = setTimeout(() => {
        const input = document.getElementById('barcode-input');
        if (input) {
          input.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      onScan(barcodeInput.trim());
      setBarcodeInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Barcode className="h-5 w-5 mr-2 text-blue-600" />
            Leitor de Código de Barras
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="barcode-input"
                type="text"
                placeholder="Escaneie ou digite o código de barras..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-center text-lg"
                autoComplete="off"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Use um leitor de código de barras ou digite manualmente
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!barcodeInput.trim()}
              >
                Confirmar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarcodeScanner;
