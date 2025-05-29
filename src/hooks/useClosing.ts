
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { toast } from '@/hooks/use-toast';

export const useClosing = () => {
  const { participants, getParticipantByCard, addClosingOption, closingOptions } = useApp();
  const [searchCard, setSearchCard] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [closingData, setClosingData] = useState({
    option: '',
    cardReturned: false,
    depositRefund: false,
    observations: ''
  });

  const handleSearch = () => {
    if (!searchCard) {
      toast({
        title: "Erro",
        description: "Digite o número do cartão para buscar",
        variant: "destructive",
      });
      return;
    }

    const participant = getParticipantByCard(searchCard);
    if (participant) {
      setSelectedParticipant(participant);
      toast({
        title: "Participante encontrado!",
        description: `${participant.name} - Saldo: R$ ${participant.balance.toFixed(2)}`,
      });
    } else {
      setSelectedParticipant(null);
      toast({
        title: "Participante não encontrado",
        description: "Verifique o número do cartão e tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleClosing = (operatorName: string) => {
    if (!selectedParticipant) {
      toast({
        title: "Erro",
        description: "Selecione um participante primeiro",
        variant: "destructive",
      });
      return false;
    }

    if (!closingData.option) {
      toast({
        title: "Erro",
        description: "Selecione uma opção de encerramento",
        variant: "destructive",
      });
      return false;
    }

    const closingOption = {
      participantId: selectedParticipant.id,
      participantName: selectedParticipant.name,
      cardNumber: selectedParticipant.cardNumber,
      remainingBalance: selectedParticipant.balance,
      option: closingData.option,
      cardReturned: closingData.cardReturned,
      depositRefund: closingData.depositRefund,
      observations: closingData.observations,
      operatorName: operatorName
    };

    addClosingOption(closingOption);

    toast({
      title: "Encerramento registrado!",
      description: `Opção "${closingData.option}" registrada para ${selectedParticipant.name}`,
    });

    // Limpar formulário
    clearForm();
    return true;
  };

  const clearForm = () => {
    setSelectedParticipant(null);
    setSearchCard('');
    setClosingData({
      option: '',
      cardReturned: false,
      depositRefund: false,
      observations: ''
    });
  };

  const getParticipantsWithBalance = () => {
    return participants.filter(p => p.balance > 0);
  };

  const getTotalPendingBalance = () => {
    return participants.reduce((total, p) => total + (p.balance > 0 ? p.balance : 0), 0);
  };

  return {
    searchCard,
    setSearchCard,
    selectedParticipant,
    setSelectedParticipant,
    closingData,
    setClosingData,
    handleSearch,
    handleClosing,
    clearForm,
    getParticipantsWithBalance,
    getTotalPendingBalance,
    closingOptions
  };
};
