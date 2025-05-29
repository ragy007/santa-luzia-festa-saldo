
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Camera, QrCode } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRCodeScannerProps {
  onScan: (cardNumber: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      toast({
        title: "Erro na Câmera",
        description: "Não foi possível acessar a câmera. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simular detecção de QR Code por enquanto
    // Em um ambiente real, você usaria uma biblioteca como jsQR
    // Para demonstração, vamos simular a leitura
    toast({
      title: "QR Code Scanner",
      description: "Por favor, digite o número do cartão manualmente por enquanto",
    });
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(scanQRCode, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Scanner QR Code
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-green-500 rounded-lg opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-48 h-48 border-2 border-white rounded-lg opacity-75"></div>
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Posicione o QR Code dentro do quadrado
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={startCamera}
                  disabled={isScanning}
                  variant="outline"
                  className="flex-1"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {isScanning ? 'Escaneando...' : 'Iniciar Câmera'}
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeScanner;
