
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  ShoppingCart, 
  Eye, 
  Settings,
  BarChart3,
  Wifi,
  UserCheck
} from 'lucide-react';

const GuiaUso: React.FC = () => {
  const guideSteps = [
    {
      icon: Settings,
      title: "1. Configurar o Sistema",
      description: "Configure as informações da festa, horários e ative o sistema",
      role: "admin",
      steps: [
        "Acesse 'Configurações > Geral'",
        "Preencha nome, data e local da festa",
        "Configure horários de início e fim",
        "Ative o sistema da festa"
      ]
    },
    {
      icon: Wifi,
      title: "2. Configurar Sincronização (Opcional)",
      description: "Conecte múltiplos dispositivos para trabalhar em equipe",
      role: "admin",
      steps: [
        "No login, ative 'Conectar a um servidor'",
        "O administrador clica 'Iniciar como Servidor'",
        "Operadores se conectam usando o IP do admin",
        "Todos os dados ficam sincronizados"
      ]
    },
    {
      icon: Users,
      title: "3. Cadastrar Participantes",
      description: "Registre pessoas e gere cartões para consumo",
      role: "admin",
      steps: [
        "Vá para 'Cadastro'",
        "Preencha nome, telefone e valor inicial",
        "O sistema gera automaticamente um cartão",
        "Imprima ou anote o número do cartão"
      ]
    },
    {
      icon: CreditCard,
      title: "4. Fazer Recargas",
      description: "Adicione créditos aos cartões dos participantes",
      role: "admin",
      steps: [
        "Acesse 'Recarga'",
        "Digite o número do cartão",
        "Informe o valor a ser adicionado",
        "Confirme a operação"
      ]
    },
    {
      icon: ShoppingCart,
      title: "5. Registrar Vendas",
      description: "Operadores registram consumo nas barracas",
      role: "operator",
      steps: [
        "Na tela 'Consumo'",
        "Digite ou escaneie o cartão",
        "Selecione produtos da sua barraca",
        "Finalize a venda"
      ]
    },
    {
      icon: Eye,
      title: "6. Consultar Saldos",
      description: "Verifique o saldo disponível em qualquer cartão",
      role: "both",
      steps: [
        "Vá para 'Consulta Saldo'",
        "Digite o número do cartão",
        "Veja saldo atual e histórico",
        "Imprima comprovante se necessário"
      ]
    },
    {
      icon: BarChart3,
      title: "7. Acompanhar Relatórios",
      description: "Monitore vendas e estatísticas da festa",
      role: "admin",
      steps: [
        "Acesse 'Relatórios'",
        "Veja vendas por barraca",
        "Acompanhe participantes mais ativos",
        "Monitore faturamento total"
      ]
    },
    {
      icon: UserCheck,
      title: "8. Encerrar a Festa",
      description: "Finalize o evento e gere relatório final",
      role: "admin",
      steps: [
        "Vá para 'Encerramento'",
        "Revise estatísticas finais",
        "Exporte dados se necessário",
        "Desative o sistema"
      ]
    }
  ];

  const tips = [
    {
      title: "🎯 Dica de Organização",
      content: "Sempre configure o sistema antes da festa começar. Teste a sincronização entre dispositivos."
    },
    {
      title: "📱 Dica de Sincronização",
      content: "Use um tablet/computador como servidor principal e celulares nas barracas como clientes."
    },
    {
      title: "💳 Dica de Cartões",
      content: "Imprima os números dos cartões em etiquetas ou use códigos QR para facilitar a leitura."
    },
    {
      title: "🔄 Dica de Backup",
      content: "Os dados ficam salvos em cada dispositivo. Mantenha o dispositivo principal sempre conectado."
    }
  ];

  return (
    <Layout title="Guia de Uso">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📖 Guia de Uso do Sistema
          </h1>
          <p className="text-gray-600 text-lg">
            Aprenda a usar todas as funcionalidades do sistema passo a passo
          </p>
        </div>

        {/* Passos do Guia */}
        <div className="space-y-6">
          {guideSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    {step.title}
                    <Badge variant={step.role === 'admin' ? 'default' : step.role === 'operator' ? 'secondary' : 'outline'}>
                      {step.role === 'admin' ? 'Admin' : step.role === 'operator' ? 'Operador' : 'Todos'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {step.steps.map((stepItem, stepIndex) => (
                      <li key={stepIndex} className="text-gray-700">{stepItem}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dicas Importantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Dicas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">{tip.title}</h4>
                  <p className="text-sm text-blue-800">{tip.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>❓ Problemas Comuns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Participante não encontrado</h4>
              <p className="text-sm text-gray-600">Verifique se o número do cartão está correto e se o participante foi cadastrado.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Sincronização não funciona</h4>
              <p className="text-sm text-gray-600">Verifique se todos os dispositivos estão na mesma rede WiFi e se o endereço IP está correto.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Saldo insuficiente</h4>
              <p className="text-sm text-gray-600">Faça uma recarga no cartão antes de tentar registrar nova venda.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Dados perdidos</h4>
              <p className="text-sm text-gray-600">Os dados ficam salvos no navegador. Evite limpar dados do navegador durante a festa.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GuiaUso;
