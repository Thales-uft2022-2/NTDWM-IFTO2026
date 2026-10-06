const amqp = require('amqplib');

class MessageBroker {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.exchangeName = process.env.RABBITMQ_EXCHANGE || 'ecommerce.events';
    this.rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    this.isConnected = false;
  }

  async connect(retries = 10, delay = 3000) {
    for (let i = 1; i <= retries; i++) {
      try {
        console.log(`[Catalog-Messaging] Conectando ao RabbitMQ (${i}/${retries}) em ${this.rabbitUrl}...`);
        this.connection = await amqp.connect(this.rabbitUrl);
        this.channel = await this.connection.createChannel();

        // Topic exchange durável
        await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });

        this.isConnected = true;
        console.log(`[Catalog-Messaging] Conectado ao RabbitMQ. Exchange: ${this.exchangeName}`);

        this.connection.on('error', (err) => {
          console.error('[Catalog-Messaging] Erro na conexão RabbitMQ:', err.message);
          this.isConnected = false;
        });

        this.connection.on('close', () => {
          console.warn('[Catalog-Messaging] Conexão encerrada. Reconectando...');
          this.isConnected = false;
          setTimeout(() => this.connect(), 5000);
        });

        return;
      } catch (err) {
        console.warn(`[Catalog-Messaging] Falha ao conectar ao RabbitMQ: ${err.message}. Retentando em ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    console.error('[Catalog-Messaging] Falha permanente de conexão com o RabbitMQ. Mensageria desativada.');
  }

  async publish(routingKey, message) {
    if (!this.isConnected || !this.channel) {
      console.warn(`[Catalog-Messaging] Mensagem não enviada (${routingKey}): Broker indisponível.`);
      return false;
    }

    try {
      const payload = Buffer.from(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
        service: 'catalog-service'
      }));

      const published = this.channel.publish(this.exchangeName, routingKey, payload, {
        persistent: true,
        contentType: 'application/json'
      });

      console.log(`[Catalog-Messaging] Evento de catálogo publicado -> [${routingKey}]`);
      return published;
    } catch (err) {
      console.error(`[Catalog-Messaging] Erro ao publicar [${routingKey}]:`, err.message);
      return false;
    }
  }
}

module.exports = new MessageBroker();
