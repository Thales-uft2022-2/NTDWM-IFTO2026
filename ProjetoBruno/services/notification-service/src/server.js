const express = require('express');
const cors = require('cors');
const eventConsumer = require('./consumer');

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

// Endpoint de saúde para probes do Docker e Kubernetes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    brokerConnected: eventConsumer.isConnected
  });
});

// Endpoint para visualização e auditoria dos eventos consumidos via RabbitMQ
app.get('/api/v1/notifications/events', (req, res) => {
  res.json({
    service: 'notification-service',
    brokerConnected: eventConsumer.isConnected,
    ...eventConsumer.getEvents()
  });
});

app.listen(PORT, async () => {
  console.log(`[Notification-Service] Microserviço rodando na porta ${PORT}`);
  await eventConsumer.start();
});
