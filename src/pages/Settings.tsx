
import React from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsGeneral from '../components/SettingsGeneral';
import SettingsTheme from '../components/SettingsTheme';
import SettingsBooths from '../components/SettingsBooths';
import SettingsUsers from '../components/SettingsUsers';
import SettingsIcons from '../components/SettingsIcons';
import SettingsDatabase from '../components/SettingsDatabase';
import { Settings as SettingsIcon, Palette, Store, Users, Database, Zap } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <SettingsIcon className="h-6 w-6 mr-2" />
            Configurações
          </h1>
          <p className="text-gray-600 mt-1">
            Configure sua festa comunitária e gerencie o sistema
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="icons" className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Ícones
            </TabsTrigger>
            <TabsTrigger value="booths" className="flex items-center">
              <Store className="h-4 w-4 mr-2" />
              Barracas
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Banco
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <SettingsGeneral />
          </TabsContent>

          <TabsContent value="theme">
            <SettingsTheme />
          </TabsContent>

          <TabsContent value="icons">
            <SettingsIcons />
          </TabsContent>

          <TabsContent value="booths">
            <SettingsBooths />
          </TabsContent>

          <TabsContent value="users">
            <SettingsUsers />
          </TabsContent>

          <TabsContent value="database">
            <SettingsDatabase />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
