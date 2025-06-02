
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Wifi, 
  Users, 
  CreditCard, 
  ShoppingCart, 
  Settings,
  UserPlus,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Monitor,
  Globe
} from 'lucide-react';

const GuiaUso: React.FC = () => {
  const Step = ({ number, title, children, icon: Icon, color = "blue" }: any) => (
    <Card className={`border-l-4 border-l-${color}-500`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center`}>
            <span className={`text-${color}-600 font-bold text-sm`}>{number}</span>
          </div>
          <Icon className={`h-5 w-5 text-${color}-600`} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <Layout title="Guia de Uso">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📚 Guia de Uso do Sistema
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Aprenda a usar o sistema passo a passo, de forma simples e prática
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="text-sm">✅ Fácil de usar</Badge>
            <Badge variant="secondary" className="text-sm">🚀 Rápido de configurar</Badge>
            <Badge variant="secondary" className="text-sm">📱 Funciona em celular e tablet</Badge>
            <Badge variant="secondary" className="text-sm">🔄 Sincronização automática</Badge>
          </div>
        </div>

        {/* Visão Geral */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">🎯 O que este sistema faz?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-700 space-y-2">
              <p>• <strong>Cadastra participantes</strong> e gera cartões/pulseiras virtuais</p>
              <p>• <strong>Faz recargas</strong> de crédito nos cartões</p>
              <p>• <strong>Registra vendas</strong> nas barracas da festa</p>
              <p>• <strong>Sincroniza tudo</strong> em tempo real entre vários dispositivos</p>
              <p>• <strong>Gera relatórios</strong> de vendas e movimentação</p>
            </div>
          </CardContent>
        </Card>

        {/* Passo 1: Configuração Inicial */}
        <Step number="1" title="Configuração Inicial do Sistema" icon={Settings} color="purple">
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">👑 Apenas o Administrador faz isso:</h4>
              <ol className="text-purple-700 space-y-2">
                <li>1. Entre no sistema com usuário <strong>"admin"</strong> e senha <strong>"123456"</strong></li>
                <li>2. Vá em <strong>⚙️ Configurações</strong> no menu lateral</li>
                <li>3. Na aba <strong>"Geral"</strong>, configure:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Nome da festa</li>
                    <li>• Data e horário</li>
                    <li>• Ative o sistema marcando "Festa Ativa"</li>
                  </ul>
                </li>
                <li>4. Na aba <strong>"Barracas"</strong>, cadastre todas as barracas da festa</li>
                <li>5. Na aba <strong>"Usuários"</strong>, crie contas para os operadores das barracas</li>
              </ol>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Importante:</span>
              </div>
              <p className="text-yellow-700">
                Faça toda a configuração inicial <strong>antes</strong> de conectar outros dispositivos!
              </p>
            </div>
          </div>
        </Step>

        {/* Passo 2: Sincronização */}
        <Step number="2" title="Conectar Outros Dispositivos" icon={Wifi} color="green">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">📱 Como conectar tablets/celulares das barracas:</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">🖥️ No dispositivo principal (Admin):</h5>
                  <ol className="text-green-600 space-y-1 ml-4">
                    <li>1. Vá em <strong>⚙️ Configurações → Sincronização</strong></li>
                    <li>2. Clique em <strong>"Iniciar como Servidor"</strong></li>
                    <li>3. Anote o endereço que aparece (ex: 192.168.1.100:3001)</li>
                  </ol>
                </div>

                <div>
                  <h5 className="font-medium text-green-700 mb-2">📱 Em cada tablet/celular das barracas:</h5>
                  <ol className="text-green-600 space-y-1 ml-4">
                    <li>1. Abra o sistema no navegador</li>
                    <li>2. Faça login com a conta do operador</li>
                    <li>3. Vá em <strong>⚙️ Configurações → Sincronização</strong></li>
                    <li>4. Digite o endereço do servidor principal</li>
                    <li>5. Clique em <strong>"Conectar ao Servidor"</strong></li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">✅ Quando conectado corretamente:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Aparecerá "Conectado" na tela de sincronização</li>
                <li>• Todos os dispositivos verão os mesmos participantes</li>
                <li>• Cadastros e recargas aparecerão instantaneamente em todos</li>
              </ul>
            </div>
          </div>
        </Step>

        {/* Passo 3: Cadastro */}
        <Step number="3" title="Cadastrar Participantes" icon={UserPlus} color="blue">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">👥 Como cadastrar pessoas:</h4>
              <ol className="text-blue-700 space-y-2">
                <li>1. Vá em <strong>👥 Cadastro</strong> no menu lateral</li>
                <li>2. Preencha os dados:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Nome completo</li>
                    <li>• Número do cartão/pulseira (invenção ou código de barras)</li>
                    <li>• Valor inicial da carga (quanto a pessoa vai carregar)</li>
                  </ul>
                </li>
                <li>3. Clique em <strong>"Cadastrar Participante"</strong></li>
                <li>4. O sistema gerará automaticamente um QR Code para a pessoa</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Dicas importantes:</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• O <strong>número do cartão</strong> pode ser qualquer coisa (001, 002, etc.)</li>
                <li>• Cada pessoa precisa ter um número diferente</li>
                <li>• Anote o número na pulseira/cartão físico da pessoa</li>
                <li>• O valor inicial já fica disponível no cartão automaticamente</li>
              </ul>
            </div>
          </div>
        </Step>

        {/* Passo 4: Recargas */}
        <Step number="4" title="Fazer Recargas" icon={CreditCard} color="orange">
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-3">💳 Como adicionar mais crédito:</h4>
              <ol className="text-orange-700 space-y-2">
                <li>1. Vá em <strong>💳 Recarga</strong> no menu lateral</li>
                <li>2. Digite o número do cartão da pessoa</li>
                <li>3. Clique em <strong>"Buscar"</strong> (🔍)</li>
                <li>4. Confirme que encontrou a pessoa certa</li>
                <li>5. Digite o valor da recarga</li>
                <li>6. Digite seu nome como operador</li>
                <li>7. Clique em <strong>"Realizar Recarga"</strong></li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">⚡ Valores rápidos:</h4>
              <p className="text-green-700">
                Use os botões de <strong>R$ 10, R$ 20, R$ 50</strong>, etc. para selecionar valores rapidamente
              </p>
            </div>
          </div>
        </Step>

        {/* Passo 5: Vendas */}
        <Step number="5" title="Registrar Vendas" icon={ShoppingCart} color="red">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">🛍️ Como registrar uma venda:</h4>
              <ol className="text-red-700 space-y-2">
                <li>1. Vá em <strong>🛍️ Consumo</strong> no menu lateral</li>
                <li>2. Digite o número do cartão do cliente</li>
                <li>3. Clique em <strong>"Buscar"</strong> (🔍)</li>
                <li>4. Verifique se o cliente tem saldo suficiente</li>
                <li>5. Digite o valor da venda</li>
                <li>6. Selecione sua barraca</li>
                <li>7. Clique em <strong>"Registrar Venda"</strong></li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Atenção:</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• Se o cliente não tiver saldo, a venda não será autorizada</li>
                <li>• O valor será descontado automaticamente do cartão</li>
                <li>• A venda aparecerá instantaneamente nos relatórios</li>
              </ul>
            </div>
          </div>
        </Step>

        {/* Passo 6: Relatórios */}
        <Step number="6" title="Ver Relatórios e Fechamento" icon={CheckCircle} color="indigo">
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-3">📊 Acompanhar vendas:</h4>
              <ul className="text-indigo-700 space-y-2">
                <li>• <strong>🏠 Dashboard:</strong> Visão geral em tempo real</li>
                <li>• <strong>📋 Histórico:</strong> Todas as transações detalhadas</li>
                <li>• <strong>📈 Relatórios:</strong> Vendas por barraca, período, etc.</li>
                <li>• <strong>🔚 Encerramento:</strong> Fechamento final da festa</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">✅ No final da festa:</h4>
              <ol className="text-green-700 space-y-1">
                <li>1. Vá em <strong>🔚 Encerramento</strong></li>
                <li>2. Verifique o relatório final</li>
                <li>3. Faça o download dos dados se precisar</li>
              </ol>
            </div>
          </div>
        </Step>

        {/* Solução de Problemas */}
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">🔧 Problemas Comuns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">❌ "Participante não encontrado"</h4>
                <p className="text-gray-600">→ Verifique se digitou o número do cartão corretamente</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">❌ "Sincronização não funciona"</h4>
                <p className="text-gray-600">→ Verifique se todos os dispositivos estão na mesma rede WiFi</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">❌ "Saldo insuficiente"</h4>
                <p className="text-gray-600">→ Cliente precisa fazer uma recarga antes de comprar</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">❌ "Sistema lento"</h4>
                <p className="text-gray-600">→ Feche outras abas do navegador e reinicie se necessário</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Pronto!</h3>
            <p className="text-green-700">
              Agora você já sabe usar o sistema completo. Em caso de dúvidas, 
              volte sempre a este guia ou peça ajuda ao administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GuiaUso;
