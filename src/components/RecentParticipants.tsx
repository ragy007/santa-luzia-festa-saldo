
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '../contexts/AppContext';
import { CreditCard } from 'lucide-react';

const RecentParticipants: React.FC = () => {
  const { participants } = useApp();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const recentParticipants = participants
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
          Últimos Cadastros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentParticipants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{participant.name}</p>
                <p className="text-sm text-gray-500">Cartão: {participant.cardNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{formatCurrency(participant.balance)}</p>
                <p className="text-xs text-gray-500">
                  {participant.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          ))}
          {participants.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhum participante cadastrado ainda
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentParticipants;
