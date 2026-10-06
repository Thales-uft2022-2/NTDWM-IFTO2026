const express = require('express');
const cors = require('cors');
const authClient = require('./auth-client');
const messageBroker = require('./messaging');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// Simulação de banco de dados do Catálogo em memória
let productsDb = [
  {
    id: 'prod-101',
    name: 'Servidor Kubernetes Enterprise',
    category: 'Cloud Infrastructure',
    price: 18500.00,
    stock: 12,
    createdBy: 'user-001',
    createdAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'prod-102',
    name: 'Message Broker RabbitMQ Appliance',
    category: 'Messaging & Queues',
    price: 9400.00,
    stock: 25,
    createdBy: 'user-001',
    createdAt: '2026-09-02T14:30:00.000Z'
  },
  {
    id: 'prod-103',
    name: 'Licença API Gateway de Alta Performance',
    category: 'Networking',
    price: 4500.00,
    stock: 50,
    createdBy: 'user-001',
    createdAt: '2026-09-05T09:15:00.000Z'
  }
];

// ==========================================
// ROTAS DE SAÚDE E DIAGNÓSTICO
// ==========================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'catalog-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    productsCount: productsDb.length,
    circuitBreaker: authClient.getStats()
  });
});

// Estatísticas detalhadas do Circuit Breaker para observabilidade
app.get('/api/v1/products/stats/circuit-breaker', (req, res) => {
  res.json(authClient.getStats());
});

// ==========================================
// ROTAS PÚBLICAS DO CATÁLOGO
// ==========================================

// 1. Listagem de Produtos (Suporta filtros e busca)
app.get('/api/v1/products', (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let result = [...productsDb];

  if (category) {
    result = result.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (minPrice) {
    result = result.filter((p) => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= parseFloat(maxPrice));
  }
  if (search) {
    result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  res.json({
    total: result.length,
    items: result
  });
});

// 2. Detalhe de Produto por ID
app.get('/api/v1/products/:id', (req, res) => {
  const product = productsDb.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado no catálogo' });
  }
  res.json(product);
});

// ==========================================
// ROTAS PROTEGIDAS (Consumo Síncrono REST do Auth com Circuit Breaker)
// ==========================================

// Middleware de Autenticação Inter-serviços
async function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acesso negado: Token Bearer obrigatório no cabeçalho Authorization'
    });
  }

  const token = authHeader.substring(7);

  // Chamada síncrona REST protegida por Circuit Breaker
  const authResult = await authClient.verifyToken(token);

  // Injeta cabeçalho com estado atual do Circuit Breaker na resposta para transparência
  res.setHeader('X-Circuit-Breaker-State', authResult.circuitState);

  // Se houve ativação de fallback (serviço de auth fora do ar)
  if (authResult.isFallback) {
    return res.status(503).json({
      error: 'Serviço temporariamente indisponível (Circuit Breaker Ativo)',
      circuitBreakerState: authResult.circuitState,
      details: authResult.reason,
      suggestion: 'O serviço de autenticação está instável ou fora do ar. A requisição foi interrompida para evitar efeito cascata.'
    });
  }

  if (!authResult.valid) {
    return res.status(401).json({
      error: 'Token inválido ou expirado',
      details: authResult.error
    });
  }

  // Anexa usuário autenticado na requisição
  req.user = authResult.user;
  next();
}

// 3. Criação de Produto (Apenas ADMIN ou usuários autenticados)
app.post('/api/v1/products', requireAuth, async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, price, stock' });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      category: category || 'Geral',
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdAt: new Date().toISOString()
    };

    productsDb.push(newProduct);

    // Publica evento assíncrono para o RabbitMQ
    await messageBroker.publish('product.created', {
      productId: newProduct.id,
      name: newProduct.name,
      price: newProduct.price,
      stock: newProduct.stock,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Produto cadastrado com sucesso',
      product: newProduct
    });
  } catch (err) {
    console.error('[Catalog-Service] Erro ao cadastrar produto:', err);
    res.status(500).json({ error: 'Erro interno ao cadastrar produto' });
  }
});

// 4. Atualização de Estoque (Emite evento de mensageria product.stock_updated)
app.put('/api/v1/products/:id/stock', requireAuth, async (req, res) => {
  try {
    const { quantityChange, newStock } = req.body;
    const product = productsDb.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const previousStock = product.stock;

    if (newStock !== undefined) {
      product.stock = parseInt(newStock, 10);
    } else if (quantityChange !== undefined) {
      product.stock += parseInt(quantityChange, 10);
    } else {
      return res.status(400).json({ error: 'Informe newStock ou quantityChange' });
    }

    // Publica evento assíncrono no RabbitMQ
    await messageBroker.publish('product.stock_updated', {
      productId: product.id,
      productName: product.name,
      previousStock,
      currentStock: product.stock,
      updatedBy: req.user.id
    });

    res.json({
      message: 'Estoque atualizado com sucesso',
      productId: product.id,
      previousStock,
      currentStock: product.stock
    });
  } catch (err) {
    console.error('[Catalog-Service] Erro ao atualizar estoque:', err);
    res.status(500).json({ error: 'Erro interno ao atualizar estoque' });
  }
});

// Inicialização do servidor
app.listen(PORT, async () => {
  console.log(`[Catalog-Service] Microserviço rodando na porta ${PORT}`);
  await messageBroker.connect();
});
