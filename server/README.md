
# Backend da Festa - Sistema de Sincronização

## 🚀 Como executar

1. **Instalar dependências:**
```bash
cd server
npm install
```

2. **Executar em desenvolvimento:**
```bash
npm run dev
```

3. **Executar em produção:**
```bash
npm start
```

## 📡 Endpoints da API

### Participantes
- `GET /api/participants` - Listar todos os participantes
- `POST /api/participants` - Criar novo participante
- `PUT /api/participants/:id` - Atualizar participante

### Transações
- `GET /api/transactions` - Listar todas as transações
- `POST /api/transactions` - Criar nova transação

### Produtos
- `GET /api/products` - Listar produtos ativos

### Barracas
- `GET /api/booths` - Listar barracas ativas

### Status
- `GET /api/status` - Status do servidor

## 📡 WebSocket

O servidor WebSocket roda na porta **8080** e envia notificações em tempo real para todos os clientes conectados.

### Eventos enviados:
- `participant-added` - Novo participante criado
- `participant-updated` - Participante atualizado
- `transaction-added` - Nova transação criada

## 🗄️ Banco de Dados

Usa SQLite com arquivo `festa.db` criado automaticamente.

### Tabelas:
- `participants` - Dados dos participantes
- `transactions` - Histórico de transações
- `products` - Catálogo de produtos
- `booths` - Cadastro de barracas

## 🔧 Configuração no Frontend

No arquivo de configuração do frontend, altere a URL da API para:
```
API_URL=http://localhost:3001
WS_URL=ws://localhost:8080
```
