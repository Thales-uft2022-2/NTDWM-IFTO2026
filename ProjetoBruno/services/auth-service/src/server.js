const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const messageBroker = require('./messaging');

const app = express();
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-production-key-change-me';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

app.use(cors());
app.use(express.json());

// Simulação de banco de dados em memória
const usersDb = [
  {
    id: 'user-001',
    name: 'Administrador Antigravity',
    email: 'admin@empresa.com',
    passwordHash: bcrypt.hashSync('Admin@123', 8),
    role: 'ADMIN'
  },
  {
    id: 'user-002',
    name: 'Cliente E-commerce',
    email: 'cliente@empresa.com',
    passwordHash: bcrypt.hashSync('Cliente@123', 8),
    role: 'CUSTOMER'
  }
];

// Estado de simulação de falha (para demonstração de Circuit Breaker)
let failureSimulation = {
  mode: 'normal', // 'normal', 'timeout', '500'
  delayMs: 3000
};

// Middleware para simulação de falhas controladas
app.use(async (req, res, next) => {
  if (req.path === '/health' || req.path === '/api/v1/auth/simulate-failure') {
    return next();
  }

  if (failureSimulation.mode === 'timeout') {
    console.warn(`[Auth-Service] [SIMULAÇÃO DE FALHA] Injetando latência de ${failureSimulation.delayMs}ms na rota ${req.path}`);
    await new Promise((resolve) => setTimeout(resolve, failureSimulation.delayMs));
  } else if (failureSimulation.mode === '500') {
    console.error(`[Auth-Service] [SIMULAÇÃO DE FALHA] Injetando HTTP 500 na rota ${req.path}`);
    return res.status(500).json({
      error: 'Simulated Internal Server Error',
      message: 'Falha forçada para teste de Circuit Breaker'
    });
  }

  next();
});

// ==========================================
// ROTAS DE SAÚDE E METADADOS
// ==========================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    brokerConnected: messageBroker.isConnected,
    failureSimulationMode: failureSimulation.mode
  });
});

// Endpoint para controle de testes do Circuit Breaker
app.post('/api/v1/auth/simulate-failure', (req, res) => {
  const { mode, delayMs } = req.body;
  if (!['normal', 'timeout', '500'].includes(mode)) {
    return res.status(400).json({ error: 'Modo inválido. Opções: normal, timeout, 500' });
  }

  failureSimulation.mode = mode;
  if (delayMs) failureSimulation.delayMs = delayMs;

  console.log(`[Auth-Service] Simulação de falha alterada para: ${mode} (delay: ${failureSimulation.delayMs}ms)`);
  res.json({
    message: 'Estado de simulação atualizado',
    failureSimulation
  });
});

// ==========================================
// ROTAS DA API DE AUTENTICAÇÃO (v1)
// ==========================================

// 1. Registro de Novo Usuário
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'CUSTOMER' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, email, password' });
    }

    const existingUser = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já cadastrado no sistema' });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 8),
      role
    };

    usersDb.push(newUser);

    // Emite evento assíncrono para a fila
    await messageBroker.publish('user.registered', {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('[Auth-Service] Erro no registro:', err);
    return res.status(500).json({ error: 'Erro interno ao registrar usuário' });
  }
});

// 2. Login e Emissão de Token JWT
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Informe email e password' });
    }

    const user = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Criação das claims do JWT (OAuth2 / OIDC compliant)
    const tokenPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iss: 'auth-service',
      aud: 'ecommerce-microservices'
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });

    // Emite evento de auditoria de login
    await messageBroker.publish('user.logged_in', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
    });

    return res.status(200).json({
      token_type: 'Bearer',
      access_token: accessToken,
      expires_in: 3600,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth-Service] Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno durante autenticação' });
  }
});

// 3. Verificação e Introspecção de Token (Comunicação Síncrona REST para outros serviços)
app.get('/api/v1/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      valid: false,
      error: 'Cabeçalho Authorization com Bearer token ausente'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({
      valid: true,
      user: {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      },
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    });
  } catch (err) {
    return res.status(401).json({
      valid: false,
      error: 'Token inválido ou expirado',
      details: err.message
    });
  }
});

// 4. Metadados de Chave Pública / Assinatura (para validação distribuída sem bater no Auth)
app.get('/api/v1/auth/jwks', (req, res) => {
  res.json({
    algorithm: 'HS256',
    issuer: 'auth-service',
    supportedAlgorithms: ['HS256', 'RS256'],
    comment: 'Em produção com chaves assimétricas RS256, este endpoint expõe o JSON Web Key Set (JWKS) com a chave pública para validação local em outros serviços.'
  });
});

// Inicialização do servidor
app.listen(PORT, async () => {
  console.log(`[Auth-Service] Microserviço rodando na porta ${PORT}`);
  await messageBroker.connect();
});
