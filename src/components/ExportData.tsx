
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useApp } from '../contexts/LocalAppContext';
import { toast } from '@/hooks/use-toast';

interface ExportDataProps {
  type: 'participants' | 'transactions' | 'full-backup';
}

const ExportData: React.FC<ExportDataProps> = ({ type }) => {
  const { participants, transactions, settings, booths, products } = useApp();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum dado para exportar",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapar valores que contêm vírgula ou aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportParticipants = () => {
    const data = participants.map(p => ({
      'Nome': p.name,
      'Número do Cartão': p.cardNumber,
      'Telefone': p.phone || '',
      'Saldo Atual': formatCurrency(p.balance),
      'Saldo Inicial': formatCurrency(p.initialBalance),
      'Status': p.isActive ? 'Ativo' : 'Inativo',
      'Data de Cadastro': new Date(p.createdAt || '').toLocaleDateString('pt-BR')
    }));

    const eventName = settings?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'festa';
    const date = new Date().toISOString().split('T')[0];
    exportToCSV(data, `participantes_${eventName}_${date}.csv`);
    
    toast({
      title: "Sucesso!",
      description: "Lista de participantes exportada com sucesso",
    });
  };

  const exportTransactions = () => {
    const data = transactions.map(t => {
      const participant = participants.find(p => p.id === t.participantId);
      return {
        'Data/Hora': new Date(t.timestamp).toLocaleString('pt-BR'),
        'Participante': participant?.name || 'N/A',
        'Cartão': participant?.cardNumber || 'N/A',
        'Tipo': t.type === 'credit' ? 'Recarga' : 'Débito',
        'Valor': formatCurrency(t.amount),
        'Descrição': t.description,
        'Barraca': t.booth || 'N/A',
        'Operador': t.operatorName
      };
    });

    const eventName = settings?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'festa';
    const date = new Date().toISOString().split('T')[0];
    exportToCSV(data, `transacoes_${eventName}_${date}.csv`);
    
    toast({
      title: "Sucesso!",
      description: "Relatório de transações exportado com sucesso",
    });
  };

  const exportFullBackup = () => {
    const eventName = settings?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'festa';
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Exportar configurações do evento
    const eventData = {
      'Nome do Evento': settings?.name || '',
      'Local': settings?.location || '',
      'Data': settings?.date || '',
      'Horário': `${settings?.startTime || ''} às ${settings?.endTime || ''}`,
      'Telefone': settings?.phone || '',
      'Título': settings?.title || '',
      'Subtítulo': settings?.subtitle || '',
      'Mensagem Religiosa': settings?.religiousMessage || '',
      'Data do Backup': new Date().toLocaleString('pt-BR')
    };

    // Criar backup completo
    const backupData = {
      evento: eventData,
      participantes: participants,
      transacoes: transactions,
      barracas: booths,
      produtos: products,
      metadata: {
        versao: '1.0',
        dataBackup: new Date().toISOString(),
        totalParticipantes: participants.length,
        totalTransacoes: transactions.length
      }
    };

    // Salvar como JSON
    const jsonBlob = new Blob([JSON.stringify(backupData, null, 2)], { 
      type: 'application/json' 
    });
    const jsonLink = document.createElement('a');
    const jsonUrl = URL.createObjectURL(jsonBlob);
    jsonLink.setAttribute('href', jsonUrl);
    jsonLink.setAttribute('download', `backup_completo_${eventName}_${timestamp}.json`);
    jsonLink.style.visibility = 'hidden';
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);

    // Também exportar participantes em CSV
    exportParticipants();
    exportTransactions();

    toast({
      title: "Backup Completo!",
      description: "Backup completo do evento exportado com sucesso",
    });
  };

  const handleExport = () => {
    switch (type) {
      case 'participants':
        exportParticipants();
        break;
      case 'transactions':
        exportTransactions();
        break;
      case 'full-backup':
        exportFullBackup();
        break;
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'participants':
        return 'Exportar Participantes';
      case 'transactions':
        return 'Exportar Transações';
      case 'full-backup':
        return 'Backup Completo';
      default:
        return 'Exportar';
    }
  };

  const getIcon = () => {
    return type === 'full-backup' ? Download : FileText;
  };

  const Icon = getIcon();

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Icon className="h-4 w-4" />
      {getButtonText()}
    </Button>
  );
};

export default ExportData;
