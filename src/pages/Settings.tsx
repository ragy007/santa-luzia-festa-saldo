
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsGeneral from '../components/SettingsGeneral';
import SettingsTheme from '../components/SettingsTheme';
import SettingsBooths from '../components/SettingsBooths';
import SettingsIcons from '../components/SettingsIcons';
import LocalSettingsUsers from '../components/LocalSettingsUsers';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <Layout title="Configurações do Sistema">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ⚙️ Configurações
          </h1>
          <p className="text-gray-600">
            Gerencie as configurações do sistema de festa
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="theme">Tema</TabsTrigger>
            <TabsTrigger value="booths">Barracas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="icons">Ícones</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <SettingsGeneral />
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <SettingsTheme />
          </TabsContent>

          <TabsContent value="booths" className="mt-6">
            <SettingsBooths />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <LocalSettingsUsers />
          </TabsContent>

          <TabsContent value="icons" className="mt-6">
            <SettingsIcons />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
