
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/LocalAppContext';
import { generateUUID } from '@/utils/idGeneration';

interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
  boothId?: string;
  isActive: boolean;
}

const LocalSettingsUsers: React.FC = () => {
  const { booths } = useApp();
  const [users, setUsers] = useState<LocalUser[]>(() => {
    const savedUsers = localStorage.getItem('festa-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'operator' as 'admin' | 'operator',
    boothId: ''
  });

  const saveUsers = (newUsers: LocalUser[]) => {
    setUsers(newUsers);
    localStorage.setItem('festa-users', JSON.stringify(newUsers));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Verificar se email já existe
    if (users.some(user => user.email === formData.email)) {
      toast({
        title: "Erro",
        description: "Este email já está cadastrado",
        variant: "destructive"
      });
      return;
    }

    const newUser: LocalUser = {
      id: generateUUID(),
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      boothId: formData.boothId === 'none' ? undefined : formData.boothId,
      isActive: true
    };

    saveUsers([...users, newUser]);

    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'operator',
      boothId: ''
    });
    setShowForm(false);

    toast({
      title: "Usuário criado!",
      description: "Novo usuário foi adicionado com sucesso",
    });
  };

  const handleDelete = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const newUsers = users.filter(user => user.id !== userId);
      saveUsers(newUsers);
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Usuários do Sistema (Local)
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do operador"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </div>

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
                <Button type="submit">Criar Usuário</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum usuário cadastrado ainda
              </p>
            ) : (
              users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      {user.role === 'admin' ? 'Administrador' : 'Operador'} 
                      {user.boothId && ` • ${booths.find(b => b.id === user.boothId)?.name}`}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
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

export default LocalSettingsUsers;
