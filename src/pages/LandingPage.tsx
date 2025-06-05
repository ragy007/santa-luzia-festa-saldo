
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  ShoppingCart, 
  BarChart3, 
  Wifi, 
  Shield,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Gestão de Participantes",
      description: "Cadastre participantes e gere cartões únicos para cada pessoa"
    },
    {
      icon: CreditCard,
      title: "Sistema de Cartões",
      description: "Recarregue cartões e controle saldos de forma simples e segura"
    },
    {
      icon: ShoppingCart,
      title: "Controle de Vendas",
      description: "Registre vendas em barracas e monitore consumo em tempo real"
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description: "Acompanhe estatísticas e faturamento de cada barraca"
    },
    {
      icon: Wifi,
      title: "Sincronização Local",
      description: "Conecte múltiplos dispositivos na mesma rede sem internet"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Dados ficam no seu dispositivo, sem envio para nuvem"
    }
  ];

  const benefits = [
    "Funciona completamente offline",
    "Interface simples e intuitiva",
    "Múltiplos dispositivos sincronizados",
    "Impressão de comprovantes",
    "Backup automático local",
    "Sem mensalidades ou taxas"
  ];

  const useCases = [
    {
      title: "Festas Juninas",
      description: "Gerencie barracas de comida, bebida e jogos com controle total de vendas"
    },
    {
      title: "Eventos Escolares",
      description: "Organize cantinas e vendas de produtos em eventos educacionais"
    },
    {
      title: "Festivais Comunitários",
      description: "Controle múltiplas barracas e atividades em eventos de bairro"
    },
    {
      title: "Feiras e Bazares",
      description: "Sistema perfeito para feiras beneficentes e bazares comunitários"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🎪 Sistema de Festa Comunitária
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie sua festa, evento ou festival de forma simples e profissional. 
            Sistema local que funciona sem internet, com sincronização entre dispositivos.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="px-8 py-3"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/guia')}
              className="px-8 py-3"
            >
              Ver Guia de Uso
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              ✨ Por que escolher nosso sistema?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-600" />
                  Sistema Local e Independente
                </h3>
                <p className="text-gray-600 mb-4">
                  Funciona 100% offline no seu navegador. Não depende de internet ou 
                  servidores externos. Seus dados ficam seguros no seu dispositivo.
                </p>
                <ul className="space-y-2">
                  {benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                  Multi-dispositivo e Sincronizado
                </h3>
                <p className="text-gray-600 mb-4">
                  Conecte tablets, smartphones e computadores na mesma rede WiFi. 
                  Todas as barracas trabalham com dados sincronizados em tempo real.
                </p>
                <ul className="space-y-2">
                  {benefits.slice(3).map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            💡 Perfeito para seus eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              🚀 Como funciona em 3 passos simples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-2">Configure</h3>
                <p className="text-sm text-gray-600">
                  Defina as informações da festa e cadastre participantes com cartões únicos
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="font-semibold mb-2">Sincronize</h3>
                <p className="text-sm text-gray-600">
                  Conecte dispositivos na mesma WiFi para trabalhar com múltiplas barracas
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold mb-2">Gerencie</h3>
                <p className="text-sm text-gray-600">
                  Registre vendas, faça recargas e acompanhe relatórios em tempo real
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Sistema gratuito, sem instalação e sem complicação. 
            Comece a usar agora mesmo!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="px-8 py-3"
            >
              Acessar Sistema
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/documentacao')}
              className="px-8 py-3"
            >
              Ver Documentação
            </Button>
          </div>
          
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="px-4 py-2">
              🚀 Sem instalação
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              💾 100% local
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              🔄 Sincronização
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              📱 Multi-dispositivo
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
