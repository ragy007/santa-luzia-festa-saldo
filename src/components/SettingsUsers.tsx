
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { UserPlus, Trash2, Users, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SettingsUsers: React.FC = () => {
  const { users, booths, loading } = useSupabaseData();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'operator' as 'admin' | 'operator',
    boothId: ''
  });

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.fullName) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create the user profile in the database
      // The user will need to sign up with this email to complete the process
      const { error } = await supabase
        .from('profiles')
        .insert({
          full_name: formData.fullName,
          role: formData.role,
          booth_id: formData.boothId === 'none' ? null : formData.boothId
        });

      if (error) throw error;

      setFormData({
        email: '',
        fullName: '',
        role: 'operator',
        boothId: ''
      });
      setShowInviteForm(false);

      toast({
        title: "Convite enviado!",
        description: `Instrua ${formData.fullName} a criar uma conta com o email ${formData.email}`,
      });
    } catch (error) {
      console.error('Error creating user invitation:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar convite de usuário",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      // Delete from profiles (this will cascade to auth.users via trigger if needed)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive"
      });
    }
  };

  // Get actual profiles from Supabase instead of local users
  const [profiles, setProfiles] = useState<any[]>([]);

  React.useEffect(() => {
    const loadProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    };

    loadProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Usuários do Sistema
          </CardTitle>
          <Button onClick={() => setShowInviteForm(!showInviteForm)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Convidar Usuário
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Sistema de Autenticação Atualizado</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  O sistema agora usa autenticação segura do Supabase. Usuários devem criar suas próprias contas
                  na aba "Cadastro" da tela de login. Administradores podem gerenciar perfis aqui.
                </p>
              </div>
            </div>
          </div>

          {showInviteForm && (
            <form onSubmit={handleInviteUser} className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Nome do usuário"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email de Referência *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este email deve ser usado pelo usuário para criar sua conta
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Perfil</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: 'admin' | 'operator') => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operator">Operador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="booth">Barraca (opcional)</Label>
                  <Select 
                    value={formData.boothId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, boothId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma barraca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma barraca</SelectItem>
                      {booths.map(booth => (
                        <SelectItem key={booth.id} value={booth.id}>
                          {booth.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Criar Perfil</Button>
                <Button type="button" variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {profiles.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum usuário cadastrado ainda
              </p>
            ) : (
              profiles.map(profile => (
                <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{profile.full_name}</div>
                    <div className="text-sm text-gray-500">ID: {profile.id}</div>
                    <div className="text-xs text-gray-400">
                      {profile.role === 'admin' ? 'Administrador' : 'Operador'} 
                      {profile.booth_id && ` • ${booths.find(b => b.id === profile.booth_id)?.name}`}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(profile.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsUsers;
