
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '../contexts/AppContext';
import { Users } from 'lucide-react';

const ParticipantStats: React.FC = () => {
  const { participants } = useApp();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalBalance = participants.reduce((total, p) => total + p.balance, 0);
  const activeParticipants = participants.filter(p => p.isActive).length;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <Users className="h-5 w-5 mr-2" />
          Resumo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-blue-700">Total de Participantes:</span>
            <span className="font-bold text-blue-800">{participants.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Cartões Ativos:</span>
            <span className="font-bold text-blue-800">{activeParticipants}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Saldo Total:</span>
            <span className="font-bold text-blue-800">
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantStats;
