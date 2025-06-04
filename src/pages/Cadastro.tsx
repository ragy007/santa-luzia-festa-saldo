
import React from 'react';
import Layout from '../components/Layout';
import ParticipantForm from '../components/ParticipantForm';
import ParticipantStats from '../components/ParticipantStats';
import RecentParticipants from '../components/RecentParticipants';
import QRCodeInfo from '../components/QRCodeInfo';
import ExportData from '../components/ExportData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Cadastro: React.FC = () => {
  return (
    <Layout title="Cadastro de Participantes">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            👥 Cadastro de Participantes
          </h1>
          <p className="text-gray-600">
            Registre novos participantes e seus cartões/pulseiras
          </p>
        </div>

        {/* Botões de Exportação */}
        <Card>
          <CardHeader>
            <CardTitle>Exportar Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <ExportData type="participants" />
              <ExportData type="transactions" />
              <ExportData type="full-backup" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Use estas opções para exportar dados do evento para análise e marketing futuro
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Cadastro */}
          <div className="lg:col-span-2 space-y-6">
            <ParticipantForm />
            <QRCodeInfo />
          </div>

          {/* Resumo e Lista */}
          <div className="space-y-6">
            <ParticipantStats />
            <RecentParticipants />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cadastro;
