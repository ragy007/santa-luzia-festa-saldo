
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Database, 
  Wifi, 
  Shield, 
  Smartphone,
  Globe,
  HardDrive,
  Users
} from 'lucide-react';

const Documentacao: React.FC = () => {
  const features = [
    {
      icon: Database,
      title: "Armazenamento Local",
      description: "Todos os dados são salvos localmente no navegador, sem necessidade de internet",
      details: [
        "Dados persistem entre sessões",
        "Não há limite de participantes",
        "Backup automático em cada dispositivo",
        "Funciona totalmente offline"
      ]
    },
    {
      icon: Wifi,
      title: "Sincronização em Tempo Real",
      description: "Conecte múltiplos dispositivos na mesma rede para trabalhar em equipe",
      details: [
        "Um dispositivo funciona como servidor",
        "Outros se conectam como clientes",
        "Sincronização automática de dados",
        "Funciona apenas com WiFi local"
      ]
    },
    {
      icon: Users,
      title: "Gestão de Usuários",
      description: "Sistema com diferentes níveis de acesso para administradores e operadores",
      details: [
        "Administradores: acesso total",
        "Operadores: apenas consumo e consulta",
        "Login seguro por email/senha",
        "Cada operador vinculado a uma barraca"
      ]
    },
    {
      icon: Shield,
      title: "Segurança e Privacidade",
      description: "Sistema projetado para máxima segurança dos dados",
      details: [
        "Dados não saem do ambiente local",
        "Sem conexão com servidores externos",
        "Controle total sobre informações",
        "Sistema independente de internet"
      ]
    }
  ];

  const technicalSpecs = [
    {
      category: "Compatibilidade",
      items: [
        "Navegadores: Chrome, Firefox, Safari, Edge",
        "Dispositivos: Computadores, tablets, smartphones",
        "Sistemas: Windows, macOS, Linux, Android, iOS",
        "Rede: WiFi local (não requer internet)"
      ]
    },
    {
      category: "Capacidade",
      items: [
        "Participantes: Ilimitado",
        "Transações: Ilimitado",
        "Barracas: Até 20 simultaneamente",
        "Operadores: Até 10 por dispositivo"
      ]
    },
    {
      category: "Performance",
      items: [
        "Resposta instantânea offline",
        "Sincronização em menos de 1 segundo",
        "Suporte a múltiplos dispositivos",
        "Interface otimizada para touch"
      ]
    }
  ];

  const architecture = [
    {
      component: "Frontend (React)",
      description: "Interface do usuário responsiva e intuitiva",
      technologies: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn/UI"]
    },
    {
      component: "Armazenamento (LocalStorage)",
      description: "Persistência de dados no navegador",
      technologies: ["Browser LocalStorage", "JSON", "Context API", "React State"]
    },
    {
      component: "Sincronização (WebSocket)",
      description: "Comunicação em tempo real entre dispositivos",
      technologies: ["WebSocket", "Peer-to-Peer", "Local Network", "Event Broadcasting"]
    },
    {
      component: "Impressão (Browser API)",
      description: "Geração de comprovantes e relatórios",
      technologies: ["Window.print()", "CSS Print Media", "QR Code", "Thermal Printer Support"]
    }
  ];

  return (
    <Layout title="Documentação">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Documentação Técnica
          </h1>
          <p className="text-gray-600 text-lg">
            Especificações técnicas e arquitetura do sistema
          </p>
        </div>

        {/* Visão Geral */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visão Geral do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              O Sistema de Festa Comunitária é uma aplicação web local, projetada para funcionar 
              completamente offline, permitindo o gerenciamento de participantes, vendas e 
              transações em eventos comunitários sem dependência de internet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-900">100% Local</p>
                <p className="text-sm text-blue-700">Sem internet</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <HardDrive className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-green-900">Dados Seguros</p>
                <p className="text-sm text-green-700">No seu dispositivo</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Wifi className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-900">Sincronização</p>
                <p className="text-sm text-purple-700">WiFi local</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Smartphone className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-orange-900">Multi-dispositivo</p>
                <p className="text-sm text-orange-700">Qualquer tela</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recursos Principais */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">🚀 Recursos Principais</h2>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Especificações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Especificações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technicalSpecs.map((spec, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 mb-3">{spec.category}</h4>
                  <ul className="space-y-2">
                    {spec.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Arquitetura do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>🏗️ Arquitetura do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {architecture.map((arch, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{arch.component}</h4>
                  <p className="text-gray-600 mb-3">{arch.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {arch.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fluxo de Dados */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Fluxo de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">1. Entrada de Dados</h4>
                <p className="text-sm text-gray-700">Usuário insere dados → Validação → Estado do React</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">2. Persistência Local</h4>
                <p className="text-sm text-gray-700">Estado → Context API → LocalStorage do navegador</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">3. Sincronização</h4>
                <p className="text-sm text-gray-700">LocalStorage → WebSocket → Outros dispositivos na rede</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">4. Visualização</h4>
                <p className="text-sm text-gray-700">Dados sincronizados → Interface → Usuário</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Rede */}
        <Card>
          <CardHeader>
            <CardTitle>🌐 Configuração de Rede</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cenário Típico de Uso:</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li><strong>Administrador:</strong> Tablet/Computador conectado ao WiFi, funcionando como servidor</li>
                    <li><strong>Barraca 1:</strong> Smartphone conectado ao mesmo WiFi, cliente do servidor</li>
                    <li><strong>Barraca 2:</strong> Tablet conectado ao mesmo WiFi, cliente do servidor</li>
                    <li><strong>Mais Barracas:</strong> Quantos dispositivos necessários, todos sincronizados</li>
                  </ol>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requisitos de Rede:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• WiFi local (roteador doméstico funciona perfeitamente)</li>
                  <li>• Todos dispositivos na mesma rede</li>
                  <li>• Não precisa de internet, apenas conectividade local</li>
                  <li>• Velocidade mínima: qualquer WiFi moderno atende</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documentacao;
