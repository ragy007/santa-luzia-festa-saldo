
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '../contexts/SettingsContext';
import { Settings as SettingsIcon, Palette, Users, Calendar, Store } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SettingsGeneral from '../components/SettingsGeneral';
import SettingsTheme from '../components/SettingsTheme';
import SettingsUsers from '../components/SettingsUsers';
import SettingsBooths from '../components/SettingsBooths';

const Settings: React.FC = () => {
  return (
    <Layout title="Configurações do Sistema">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ⚙️ Configurações
          </h1>
          <p className="text-gray-600">
            Personalize sua festa e gerencie o sistema
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="booths" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Barracas
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <SettingsGeneral />
          </TabsContent>

          <TabsContent value="booths">
            <SettingsBooths />
          </TabsContent>

          <TabsContent value="theme">
            <SettingsTheme />
          </TabsContent>

          <TabsContent value="users">
            <SettingsUsers />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
