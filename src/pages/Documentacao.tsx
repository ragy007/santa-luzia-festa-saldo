
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Users, 
  CreditCard, 
  ShoppingCart, 
  Settings,
  UserPlus,
  Search,
  Eye,
  Printer,
  Download,
  Wifi,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Smartphone,
  FileText,
  BarChart3,
  Clock,
  Globe
} from 'lucide-react';

const Documentacao: React.FC = () => {
  const Section = ({ title, icon: Icon, children, color = "blue" }: any) => (
    <Card className={`border-l-4 border-l-${color}-500 mb-6`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon className={`h-6 w-6 text-${color}-600`} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  const Feature = ({ name, description, icon: Icon }: any) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <Icon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );

  return (
    <Layout title="Documentação">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Documentação Completa
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Sistema de Gestão de Festas Comunitárias
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="text-sm">📱 Multi-dispositivo</Badge>
            <Badge variant="secondary" className="text-sm">🔄 Sincronização em tempo real</Badge>
            <Badge variant="secondary" className="text-sm">💳 Gestão de cartões</Badge>
            <Badge variant="secondary" className="text-sm">📊 Relatórios detalhados</Badge>
            <Badge variant="secondary" className="text-sm">🖨️ Impressão de filipetas</Badge>
          </div>
        </div>

        {/* Visão Geral */}
        <Section title="Visão Geral do Sistema" icon={Monitor} color="purple">
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              O Sistema de Gestão de Festas Comunitárias é uma solução completa para gerenciar eventos 
              com sistema de cartões/pulseiras pré-pagos. Desenvolvido especificamente para festas 
              comunitárias, juninas, religiosas e eventos similares.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Objetivo Principal</h4>
                <p className="text-blue-700 text-sm">
                  Simplificar a gestão financeira de festas, eliminando o uso de dinheiro físico 
                  e centralizando todas as transações em um sistema digital confiável.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Benefícios</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Controle total das vendas</li>
                  <li>• Relatórios em tempo real</li>
                  <li>• Redução de perdas e roubos</li>
                  <li>• Facilidade para os participantes</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Funcionalidades */}
        <Section title="Funcionalidades Principais" icon={Settings} color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Feature 
              name="Cadastro de Participantes"
              description="Registre participantes com cartões/pulseiras numerados e carga inicial"
              icon={UserPlus}
            />
            <Feature 
              name="Recarga de Créditos"
              description="Adicione saldo aos cartões dos participantes de forma rápida"
              icon={CreditCard}
            />
            <Feature 
              name="Registro de Vendas"
              description="Registre vendas nas barracas com débito automático do saldo"
              icon={ShoppingCart}
            />
            <Feature 
              name="Consulta de Saldo"
              description="Consulte saldo e histórico de qualquer participante"
              icon={Eye}
            />
            <Feature 
              name="Impressão de Filipetas"
              description="Imprima comprovantes para cadastro, recarga e consumo"
              icon={Printer}
            />
            <Feature 
              name="Sincronização Multi-dispositivos"
              description="Conecte vários tablets/celulares em tempo real"
              icon={Wifi}
            />
            <Feature 
              name="Relatórios Completos"
              description="Visualize vendas por barraca, período e participante"
              icon={BarChart3}
            />
            <Feature 
              name="Exportação de Dados"
              description="Exporte dados para Excel e faça backup completo"
              icon={Download}
            />
          </div>
        </Section>

        {/* Módulos do Sistema */}
        <Section title="Módulos do Sistema" icon={Database} color="green">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-blue-800">
                    <Users className="h-5 w-5 mr-2" />
                    Cadastro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-blue-700 text-sm">• Registro de participantes</p>
                  <p className="text-blue-700 text-sm">• Geração de QR Codes</p>
                  <p className="text-blue-700 text-sm">• Carga inicial automática</p>
                  <p className="text-blue-700 text-sm">• Impressão de filipeta</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-green-800">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Recarga
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-green-700 text-sm">• Adição de créditos</p>
                  <p className="text-green-700 text-sm">• Valores rápidos</p>
                  <p className="text-green-700 text-sm">• Histórico de recargas</p>
                  <p className="text-green-700 text-sm">• Comprovante de recarga</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-purple-800">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Consumo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-purple-700 text-sm">• Registro de vendas</p>
                  <p className="text-purple-700 text-sm">• Controle por barraca</p>
                  <p className="text-purple-700 text-sm">• Verificação de saldo</p>
                  <p className="text-purple-700 text-sm">• Nota fiscal simplificada</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-orange-800">
                    <Eye className="h-5 w-5 mr-2" />
                    Consultar Saldo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-orange-700 text-sm">• Verificação de saldo</p>
                  <p className="text-orange-700 text-sm">• Histórico de transações</p>
                  <p className="text-orange-700 text-sm">• Dados do participante</p>
                  <p className="text-orange-700 text-sm">• Impressão de extrato</p>
                </CardContent>
              </Card>

              <Card className="bg-indigo-50 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-indigo-800">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Relatórios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-indigo-700 text-sm">• Vendas por barraca</p>
                  <p className="text-indigo-700 text-sm">• Movimentação financeira</p>
                  <p className="text-indigo-700 text-sm">• Ranking de vendas</p>
                  <p className="text-indigo-700 text-sm">• Gráficos em tempo real</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-red-800">
                    <Clock className="h-5 w-5 mr-2" />
                    Encerramento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-red-700 text-sm">• Fechamento da festa</p>
                  <p className="text-red-700 text-sm">• Relatório final</p>
                  <p className="text-red-700 text-sm">• Devolução de cartões</p>
                  <p className="text-red-700 text-sm">• Backup automático</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Section>

        {/* Setup e Configuração */}
        <Section title="Configuração Inicial" icon={Settings} color="orange">
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-4">🔧 Passo a Passo da Configuração</h4>
              <ol className="text-orange-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Login Inicial:</strong> Entre com usuário "admin" e senha "123456"
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Configurações Gerais:</strong> Defina nome da festa, data, local e horários
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Barracas:</strong> Cadastre todas as barracas/stands da festa
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  <div>
                    <strong>Usuários:</strong> Crie contas para operadores das barracas
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-200 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                  <div>
                    <strong>Ativação:</strong> Marque "Festa Ativa" para iniciar as operações
                  </div>
                </li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">📱 Requisitos Técnicos</h5>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Navegador web moderno</li>
                  <li>• Conexão WiFi local</li>
                  <li>• Tablets ou smartphones</li>
                  <li>• Impressora térmica (opcional)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">🔒 Segurança</h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Contas por função (admin/operador)</li>
                  <li>• Backup automático dos dados</li>
                  <li>• Sincronização criptografada</li>
                  <li>• Logs de todas as transações</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Sincronização */}
        <Section title="Sincronização Multi-dispositivos" icon={Wifi} color="green">
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-4">🔄 Como Funciona</h4>
              <p className="text-green-700 mb-4">
                O sistema permite conectar vários dispositivos (tablets, celulares) para trabalhar 
                simultaneamente. Todas as transações são sincronizadas em tempo real entre todos os dispositivos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-800 mb-2">🖥️ Dispositivo Principal (Servidor)</h5>
                  <ol className="text-green-700 text-sm space-y-1">
                    <li>1. Vá em Configurações → Sincronização</li>
                    <li>2. Clique em "Iniciar como Servidor"</li>
                    <li>3. Anote o endereço IP:porta exibido</li>
                    <li>4. Mantenha este dispositivo sempre ligado</li>
                  </ol>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-800 mb-2">📱 Dispositivos das Barracas (Clientes)</h5>
                  <ol className="text-green-700 text-sm space-y-1">
                    <li>1. Faça login com conta do operador</li>
                    <li>2. Vá em Configurações → Sincronização</li>
                    <li>3. Digite o endereço do servidor</li>
                    <li>4. Clique em "Conectar ao Servidor"</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Importante:</span>
              </div>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Todos os dispositivos devem estar na mesma rede WiFi</li>
                <li>• O dispositivo servidor deve ficar sempre conectado</li>
                <li>• Teste a conexão antes de iniciar a festa</li>
                <li>• Mantenha backup automático ativado</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Fluxo de Trabalho */}
        <Section title="Fluxo de Trabalho Típico" icon={CheckCircle} color="indigo">
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-4">📋 Durante a Festa</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-3">🎫 Entrada da Festa</h5>
                  <ol className="text-indigo-700 text-sm space-y-2">
                    <li>1. Cadastrar participante</li>
                    <li>2. Definir valor inicial</li>
                    <li>3. Entregar cartão/pulseira</li>
                    <li>4. Imprimir filipeta inicial</li>
                  </ol>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-3">💰 Durante o Evento</h5>
                  <ol className="text-indigo-700 text-sm space-y-2">
                    <li>1. Recarregar cartões quando necessário</li>
                    <li>2. Registrar vendas nas barracas</li>
                    <li>3. Consultar saldos quando solicitado</li>
                    <li>4. Imprimir comprovantes</li>
                  </ol>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-3">🏁 Final da Festa</h5>
                  <ol className="text-indigo-700 text-sm space-y-2">
                    <li>1. Verificar saldos restantes</li>
                    <li>2. Devolver cartões/dinheiro</li>
                    <li>3. Gerar relatório final</li>
                    <li>4. Fazer backup dos dados</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Impressão */}
        <Section title="Sistema de Impressão" icon={Printer} color="red">
          <div className="space-y-4">
            <p className="text-gray-700">
              O sistema gera filipetas (comprovantes) para todas as operações principais, 
              facilitando o controle e proporcionando transparência aos participantes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-800 text-sm">Filipeta de Cadastro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-red-700 text-xs">• Dados do participante</p>
                  <p className="text-red-700 text-xs">• Número do cartão</p>
                  <p className="text-red-700 text-xs">• Saldo inicial</p>
                  <p className="text-red-700 text-xs">• Data e operador</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-800 text-sm">Filipeta de Recarga</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-red-700 text-xs">• Valor da recarga</p>
                  <p className="text-red-700 text-xs">• Saldo anterior</p>
                  <p className="text-red-700 text-xs">• Saldo atual</p>
                  <p className="text-red-700 text-xs">• Comprovante fiscal</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-800 text-sm">Filipeta de Consumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-red-700 text-xs">• Itens consumidos</p>
                  <p className="text-red-700 text-xs">• Valor da compra</p>
                  <p className="text-red-700 text-xs">• Saldo restante</p>
                  <p className="text-red-700 text-xs">• Barraca responsável</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">📝 Formato das Filipetas</h5>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Otimizado para impressoras térmicas de 80mm</li>
                <li>• Inclui informações do evento (nome, data, local)</li>
                <li>• Mensagem religiosa personalizada (opcional)</li>
                <li>• QR Code para verificação (futuro)</li>
                <li>• Layout responsivo para impressão em qualquer tamanho</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Exportação e Backup */}
        <Section title="Exportação e Backup" icon={Download} color="purple">
          <div className="space-y-4">
            <p className="text-gray-700">
              O sistema oferece várias opções de exportação para análise posterior e backup de segurança.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">📊 Participantes (CSV)</h5>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Lista completa de participantes</li>
                  <li>• Dados de contato para marketing</li>
                  <li>• Saldos finais</li>
                  <li>• Datas de cadastro</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">💰 Transações (CSV)</h5>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Todas as transações detalhadas</li>
                  <li>• Vendas por barraca</li>
                  <li>• Recargas realizadas</li>
                  <li>• Análise de fluxo de caixa</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">💾 Backup Completo (JSON)</h5>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Todos os dados do sistema</li>
                  <li>• Configurações da festa</li>
                  <li>• Estrutura completa</li>
                  <li>• Possibilidade de restauração</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">✅ Recomendações de Backup</h5>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Faça backup antes de iniciar a festa</li>
                <li>• Exporte dados a cada 2 horas durante o evento</li>
                <li>• Mantenha backups em dispositivos diferentes</li>
                <li>• Use os dados de participantes para marketing futuro</li>
                <li>• Analise relatórios para melhorar próximos eventos</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Troubleshooting */}
        <Section title="Solução de Problemas" icon={AlertTriangle} color="red">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-red-800">❌ Problemas Comuns</h5>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h6 className="font-semibold text-red-800 mb-2">Participante não encontrado</h6>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Verifique se digitou o número corretamente</li>
                    <li>• Confira se não há espaços extras</li>
                    <li>• Confirme se o participante foi cadastrado</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h6 className="font-semibold text-red-800 mb-2">Sincronização não funciona</h6>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Verifique se todos estão na mesma WiFi</li>
                    <li>• Confirme se o servidor está ativo</li>
                    <li>• Reinicie a conexão nos clientes</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h6 className="font-semibold text-red-800 mb-2">Saldo insuficiente</h6>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Oriente o cliente a fazer recarga</li>
                    <li>• Verifique o saldo atual do cartão</li>
                    <li>• Confirme o valor da compra</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <h5 className="font-semibold text-green-800">✅ Soluções Rápidas</h5>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h6 className="font-semibold text-green-800 mb-2">Sistema lento</h6>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Feche outras abas do navegador</li>
                    <li>• Reinicie o navegador</li>
                    <li>• Verifique a conexão WiFi</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h6 className="font-semibold text-green-800 mb-2">Impressora não funciona</h6>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Verifique se está conectada</li>
                    <li>• Confirme se há papel</li>
                    <li>• Teste com impressão padrão</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h6 className="font-semibold text-green-800 mb-2">Configurações não salvam</h6>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Clique em "Salvar" após cada alteração</li>
                    <li>• Aguarde a confirmação aparecer</li>
                    <li>• Recarregue a página para verificar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Suporte */}
        <Section title="Suporte e Contato" icon={Globe} color="blue">
          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-4">📞 Canais de Suporte</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">🆘 Suporte Técnico</h5>
                  <p className="text-blue-700 text-sm mb-2">
                    Para problemas técnicos durante o evento:
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Email: suporte@festasistema.com</li>
                    <li>• WhatsApp: (11) 99999-9999</li>
                    <li>• Horário: 24h durante eventos</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">💡 Sugestões e Melhorias</h5>
                  <p className="text-blue-700 text-sm mb-2">
                    Para sugestões de novas funcionalidades:
                  </p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Email: feedback@festasistema.com</li>
                    <li>• Formulário online disponível</li>
                    <li>• Avaliação pós-evento</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm text-center">
                Esta documentação foi gerada automaticamente pelo sistema. 
                Versão 1.0 - Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  );
};

export default Documentacao;
