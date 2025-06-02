
import React from 'react';
import Layout from '../components/Layout';
import SettingsSync from '../components/SettingsSync';

const Sincronizacao: React.FC = () => {
  return (
    <Layout title="Sincronização">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔄 Sincronização
          </h1>
          <p className="text-gray-600">
            Conecte este dispositivo ao servidor principal
          </p>
        </div>

        <SettingsSync />
      </div>
    </Layout>
  );
};

export default Sincronizacao;
