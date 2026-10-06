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
        console.log(`[Auth-Messaging] Conectando ao RabbitMQ (${i}/${retries}) em ${this.rabbitUrl}...`);
        this.connection = await amqp.connect(this.rabbitUrl);
        this.channel = await this.connection.createChannel();

        // Exchange topic durável para eventos do ecossistema
        await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });

        this.isConnected = true;
        console.log(`[Auth-Messaging] Conectado com sucesso ao RabbitMQ. Exchange: ${this.exchangeName}`);

        this.connection.on('error', (err) => {
          console.error('[Auth-Messaging] Erro na conexão RabbitMQ:', err.message);
          this.isConnected = false;
        });

        this.connection.on('close', () => {
          console.warn('[Auth-Messaging] Conexão RabbitMQ encerrada. Tentando reconectar...');
          this.isConnected = false;
          setTimeout(() => this.connect(), 5000);
        });

        return;
      } catch (err) {
        console.warn(`[Auth-Messaging] Falha ao conectar ao RabbitMQ: ${err.message}. Nova tentativa em ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    console.error('[Auth-Messaging] Não foi possível conectar ao RabbitMQ após múltiplas tentativas. Executando em modo degradado sem mensageria.');
  }

  async publish(routingKey, message) {
    if (!this.isConnected || !this.channel) {
      console.warn(`[Auth-Messaging] Mensagem não enviada (${routingKey}): Broker indisponível.`);
      return false;
    }

    try {
      const payload = Buffer.from(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
        service: 'auth-service'
      }));

      const published = this.channel.publish(this.exchangeName, routingKey, payload, {
        persistent: true,
        contentType: 'application/json'
      });

      console.log(`[Auth-Messaging] Evento publicado -> [${routingKey}]`);
      return published;
    } catch (err) {
      console.error(`[Auth-Messaging] Erro ao publicar mensagem [${routingKey}]:`, err.message);
      return false;
    }
  }
}

module.exports = new MessageBroker();
