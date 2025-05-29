
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  CreditCard, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  DollarSign, 
  History,
  Settings,
  ChevronRight,
  Star,
  CheckCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: UserPlus,
      title: "Cadastro de Participantes",
      description: "Registre participantes com QR Code único para identificação rápida e segura.",
      steps: [
        "Acesse o menu 'Cadastro'",
        "Preencha os dados do participante",
        "Defina o saldo inicial do cartão",
        "Gere automaticamente o QR Code único"
      ]
    },
    {
      icon: CreditCard,
      title: "Sistema de Recarga",
      description: "Adicione créditos aos cartões dos participantes de forma simples e controlada.",
      steps: [
        "Escaneie o QR Code do participante",
        "Insira o valor da recarga",
        "Confirme a transação",
        "Saldo atualizado automaticamente"
      ]
    },
    {
      icon: ShoppingCart,
      title: "Controle de Consumo",
      description: "Registre vendas nas barracas com débito automático do saldo do participante.",
      steps: [
        "Selecione a barraca vendedora",
        "Escaneie o QR Code do cliente",
        "Insira o valor da compra",
        "Confirme e debite do saldo"
      ]
    },
    {
      icon: BarChart3,
      title: "Relatórios Completos",
      description: "Acompanhe vendas, receitas e performance de cada barraca em tempo real.",
      steps: [
        "Visualize vendas por barraca",
        "Monitore total arrecadado",
        "Acompanhe participantes ativos",
        "Exporte dados para análise"
      ]
    },
    {
      icon: History,
      title: "Histórico de Transações",
      description: "Mantenha registro completo de todas as movimentações financeiras.",
      steps: [
        "Consulte histórico por participante",
        "Filtre por tipo de transação",
        "Visualize detalhes completos",
        "Auditoria transparente"
      ]
    },
    {
      icon: Settings,
      title: "Configurações Personalizáveis",
      description: "Customize o sistema com as informações e visual da sua festa.",
      steps: [
        "Configure dados da festa",
        "Personalize cores e ícones",
        "Gerencie usuários do sistema",
        "Defina barracas participantes"
      ]
    }
  ];

  const benefits = [
    "Controle total das vendas e recargas",
    "Redução de filas e agilidade no atendimento",
    "Transparência financeira completa",
    "Relatórios em tempo real",
    "Sistema seguro com QR Codes únicos",
    "Interface simples e intuitiva"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/4696e03b-2d43-4fd1-a5de-3296a270182a.png" 
                alt="Centro Social da Paróquia Santa Luzia" 
                className="h-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Sistema de Gestão de Festas
                </h1>
                <p className="text-sm text-gray-500">Centro Social Santa Luzia</p>
              </div>
            </div>
            <Button onClick={() => navigate('/auth')} className="bg-blue-600 hover:bg-blue-700">
              Acessar Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema Completo para
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Gestão de Festas
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie participantes, controle vendas, monitore receitas e tenha relatórios completos 
            da sua festa comunitária com nosso sistema intuitivo e seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
            >
              Começar Agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8"
            >
              Ver Funcionalidades
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que usar nosso sistema?
            </h2>
            <p className="text-lg text-gray-600">
              Benefícios que fazem a diferença na sua festa
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar sua festa de forma profissional e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <p className="text-gray-600 font-normal">{feature.description}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Como usar:</h4>
                      {feature.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <span className="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                            {stepIndex + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Sistema Confiável e Eficiente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100">Controle Financeiro</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-blue-100">Erros de Cálculo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Disponibilidade</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pronto para transformar sua festa?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Comece a usar nosso sistema hoje mesmo e tenha total controle sobre sua festa comunitária.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-4"
          >
            Acessar Sistema Agora
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <img 
              src="/lovable-uploads/4696e03b-2d43-4fd1-a5de-3296a270182a.png" 
              alt="Centro Social da Paróquia Santa Luzia" 
              className="h-16 mx-auto mb-6 bg-white p-2 rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Sistema de Gestão de Festas</h3>
            <p className="text-gray-400 mb-6">
              Desenvolvido pela Equipe Centro Social Santa Luzia
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500">
                © 2024 Centro Social da Paróquia Santa Luzia. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
