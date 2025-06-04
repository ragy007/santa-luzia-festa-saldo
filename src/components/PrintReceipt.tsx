
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useApp } from '../contexts/LocalAppContext';

interface PrintReceiptProps {
  type: 'cadastro' | 'recarga' | 'consumo';
  data: {
    participantName: string;
    cardNumber: string;
    amount?: number;
    balance: number;
    items?: string;
    operatorName: string;
  };
}

const PrintReceipt: React.FC<PrintReceiptProps> = ({ type, data }) => {
  const { settings } = useApp();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = () => {
    return new Date().toLocaleString('pt-BR');
  };

  const getReceiptTitle = () => {
    switch (type) {
      case 'cadastro':
        return 'CADASTRO DE PARTICIPANTE';
      case 'recarga':
        return 'RECARGA DE CRÉDITOS';
      case 'consumo':
        return 'COMPROVANTE DE COMPRA';
      default:
        return 'COMPROVANTE';
    }
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Filipeta - ${getReceiptTitle()}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 5mm;
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.2;
            margin: 0;
            padding: 5px;
            width: 70mm;
          }
          
          .receipt {
            text-align: center;
          }
          
          .header {
            border-bottom: 2px dashed #000;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          
          .title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          
          .subtitle {
            font-size: 10px;
            margin-bottom: 2px;
          }
          
          .event-info {
            font-size: 10px;
            margin-bottom: 5px;
          }
          
          .section {
            text-align: left;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px dashed #000;
          }
          
          .section:last-child {
            border-bottom: none;
          }
          
          .line {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }
          
          .amount {
            font-weight: bold;
            font-size: 14px;
          }
          
          .footer {
            text-align: center;
            font-size: 9px;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 2px dashed #000;
          }
          
          .religious {
            font-style: italic;
            margin-top: 5px;
          }
          
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="title">${settings?.title || settings?.name || 'FESTA COMUNITÁRIA'}</div>
            <div class="subtitle">${settings?.subtitle || settings?.location || ''}</div>
            <div class="event-info">${settings?.date ? new Date(settings.date).toLocaleDateString('pt-BR') : ''}</div>
            <div class="event-info">${settings?.startTime || ''} às ${settings?.endTime || ''}</div>
          </div>
          
          <div class="section">
            <div style="text-align: center; font-weight: bold; margin-bottom: 5px;">
              ${getReceiptTitle()}
            </div>
            <div class="line">
              <span>Data/Hora:</span>
              <span>${formatDateTime()}</span>
            </div>
            <div class="line">
              <span>Participante:</span>
              <span>${data.participantName}</span>
            </div>
            <div class="line">
              <span>Cartão Nº:</span>
              <span>${data.cardNumber}</span>
            </div>
            <div class="line">
              <span>Operador:</span>
              <span>${data.operatorName}</span>
            </div>
          </div>
          
          ${type === 'recarga' ? `
            <div class="section">
              <div class="line">
                <span>Valor Recarga:</span>
                <span class="amount">+${formatCurrency(data.amount || 0)}</span>
              </div>
              <div class="line">
                <span>Saldo Anterior:</span>
                <span>${formatCurrency((data.balance || 0) - (data.amount || 0))}</span>
              </div>
              <div class="line">
                <span>Saldo Atual:</span>
                <span class="amount">${formatCurrency(data.balance || 0)}</span>
              </div>
            </div>
          ` : ''}
          
          ${type === 'consumo' ? `
            <div class="section">
              <div style="margin-bottom: 5px; font-weight: bold;">Itens:</div>
              <div style="font-size: 10px; margin-bottom: 5px;">${data.items || ''}</div>
              <div class="line">
                <span>Total Compra:</span>
                <span class="amount">-${formatCurrency(data.amount || 0)}</span>
              </div>
              <div class="line">
                <span>Saldo Anterior:</span>
                <span>${formatCurrency((data.balance || 0) + (data.amount || 0))}</span>
              </div>
              <div class="line">
                <span>Saldo Atual:</span>
                <span class="amount">${formatCurrency(data.balance || 0)}</span>
              </div>
            </div>
          ` : ''}
          
          ${type === 'cadastro' ? `
            <div class="section">
              <div class="line">
                <span>Saldo Inicial:</span>
                <span class="amount">${formatCurrency(data.balance || 0)}</span>
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <div>Guarde este comprovante</div>
            <div>Em caso de dúvidas, procure a organização</div>
            ${settings?.phone ? `<div>Contato: ${settings.phone}</div>` : ''}
            ${settings?.religiousMessage ? `<div class="religious">${settings.religiousMessage}</div>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Button
      onClick={printReceipt}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      <Printer className="h-4 w-4 mr-1" />
      Imprimir Filipeta
    </Button>
  );
};

export default PrintReceipt;
