
const express = require('express');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados SQLite
const db = new sqlite3.Database('./festa.db');

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de participantes
  db.run(`CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cardNumber TEXT UNIQUE NOT NULL,
    qrCode TEXT,
    balance REAL DEFAULT 0,
    initialBalance REAL DEFAULT 0,
    createdAt TEXT,
    isActive BOOLEAN DEFAULT 1,
    phone TEXT
  )`);

  // Tabela de transações
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    participantId TEXT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    booth TEXT,
    timestamp TEXT,
    operatorName TEXT,
    FOREIGN KEY(participantId) REFERENCES participants(id)
  )`);

  // Tabela de produtos
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    booth TEXT NOT NULL,
    isActive BOOLEAN DEFAULT 1,
    isFree BOOLEAN DEFAULT 0
  )`);

  // Tabela de barracas
  db.run(`CREATE TABLE IF NOT EXISTS booths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    isActive BOOLEAN DEFAULT 1,
    totalSales REAL DEFAULT 0
  )`);

  // Inserir dados padrão
  db.get("SELECT COUNT(*) as count FROM booths", (err, row) => {
    if (row.count === 0) {
      const defaultBooths = [
        { id: uuidv4(), name: 'Barraca de Bebidas', description: 'Refrigerantes, sucos e água' },
        { id: uuidv4(), name: 'Barraca de Comidas', description: 'Lanches e refeições' },
        { id: uuidv4(), name: 'Barraca de Doces', description: 'Doces e sobremesas' }
      ];

      defaultBooths.forEach(booth => {
        db.run("INSERT INTO booths (id, name, description) VALUES (?, ?, ?)", 
               [booth.id, booth.name, booth.description]);
      });
    }
  });
});

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Cliente conectado via WebSocket');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Cliente desconectado');
  });
});

// Função para broadcast via WebSocket
function broadcast(type, data) {
  const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// ROTAS DA API

// Participantes
app.get('/api/participants', (req, res) => {
  db.all("SELECT * FROM participants ORDER BY createdAt DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/participants', (req, res) => {
  const { name, cardNumber, phone, balance, initialBalance } = req.body;
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const qrCode = `FESTA-${cardNumber}`;

  db.run(
    "INSERT INTO participants (id, name, cardNumber, qrCode, balance, initialBalance, createdAt, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, name, cardNumber, qrCode, balance || 0, initialBalance || 0, createdAt, phone],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      const newParticipant = {
        id, name, cardNumber, qrCode, 
        balance: balance || 0, 
        initialBalance: initialBalance || 0, 
        createdAt, 
        isActive: 1,
        phone
      };
      
      broadcast('participant-added', newParticipant);
      res.json(newParticipant);
    }
  );
});

app.put('/api/participants/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  db.run(`UPDATE participants SET ${fields} WHERE id = ?`, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    broadcast('participant-updated', { id, updates });
    res.json({ success: true });
  });
});

// Transações
app.get('/api/transactions', (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY timestamp DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/transactions', (req, res) => {
  const { participantId, type, amount, description, booth, operatorName } = req.body;
  const id = uuidv4();
  const timestamp = new Date().toISOString();

  db.run(
    "INSERT INTO transactions (id, participantId, type, amount, description, booth, timestamp, operatorName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, participantId, type, amount, description, booth, timestamp, operatorName],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Atualizar saldo do participante
      const balanceChange = type === 'credit' ? amount : -amount;
      db.run("UPDATE participants SET balance = balance + ? WHERE id = ?", [balanceChange, participantId]);
      
      const newTransaction = {
        id, participantId, type, amount, description, booth, timestamp, operatorName
      };
      
      broadcast('transaction-added', newTransaction);
      res.json(newTransaction);
    }
  );
});

// Produtos
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products WHERE isActive = 1", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Barracas
app.get('/api/booths', (req, res) => {
  db.all("SELECT * FROM booths WHERE isActive = 1", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Status da API
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend da festa funcionando!',
    clients: clients.size 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 WebSocket rodando na porta 8080`);
  console.log(`🗄️ Banco de dados: festa.db`);
});
