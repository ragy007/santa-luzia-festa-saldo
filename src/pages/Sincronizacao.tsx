
import React from 'react';
import Layout from '../components/Layout';
import SettingsSync from '../components/SettingsSync';
import BackendSyncSettings from '../components/BackendSyncSettings';

const Sincronizacao: React.FC = () => {
  return (
    <Layout title="Sincronização">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔄 Sincronização
          </h1>
          <p className="text-gray-600">
            Configure a sincronização entre dispositivos
          </p>
        </div>

        {/* Backend Sync (Recomendado) */}
        <BackendSyncSettings />

        {/* Local Sync (Fallback) */}
        <SettingsSync />
      </div>
    </Layout>
  );
};

export default Sincronizacao;
