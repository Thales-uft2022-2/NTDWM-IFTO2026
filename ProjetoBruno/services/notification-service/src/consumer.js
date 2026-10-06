const amqp = require('amqplib');

class EventConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
    this.exchangeName = process.env.RABBITMQ_EXCHANGE || 'ecommerce.events';
    this.dlxExchangeName = 'ecommerce.dlx';
    this.queueName = 'notification.events';
    this.dlqName = 'ecommerce.events.dlq';
    this.isConnected = false;

    // Buffer de eventos recebidos em memória para inspeção via API
    this.receivedEvents = [];
    this.deadLetterEvents = [];
  }

  async start(retries = 10, delay = 3000) {
    for (let i = 1; i <= retries; i++) {
      try {
        console.log(`[Notification-Consumer] Conectando ao RabbitMQ (${i}/${retries}) em ${this.rabbitUrl}...`);
        this.connection = await amqp.connect(this.rabbitUrl);
        this.channel = await this.connection.createChannel();

        // 1. Configura Dead Letter Exchange (DLX) e Fila DLQ para resiliência
        await this.channel.assertExchange(this.dlxExchangeName, 'direct', { durable: true });
        await this.channel.assertQueue(this.dlqName, { durable: true });
        await this.channel.bindQueue(this.dlqName, this.dlxExchangeName, 'dead.letter');

        // 2. Configura Exchange Principal (Topic)
        await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });

        // 3. Configura Fila Principal com encaminhamento automático para DLQ em caso de rejeição
        await this.channel.assertQueue(this.queueName, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': this.dlxExchangeName,
            'x-dead-letter-routing-key': 'dead.letter'
          }
        });

        // 4. Binds nos tópicos de interesse: produtos e usuários
        await this.channel.bindQueue(this.queueName, this.exchangeName, 'product.*');
        await this.channel.bindQueue(this.queueName, this.exchangeName, 'user.*');

        // Configuração de QoS (Prefetch) para evitar sobrecarga do consumidor
        await this.channel.prefetch(5);

        this.isConnected = true;
        console.log(`[Notification-Consumer] Consumidor ativo na fila [${this.queueName}]. Aguardando eventos...`);

        // 5. Loop de consumo da fila principal
        this.channel.consume(this.queueName, (msg) => this._processMessage(msg), { noAck: false });

        // 6. Loop de consumo da DLQ para auditoria de falhas
        this.channel.consume(this.dlqName, (msg) => this._processDlqMessage(msg), { noAck: false });

        this.connection.on('error', (err) => {
          console.error('[Notification-Consumer] Erro de conexão:', err.message);
          this.isConnected = false;
        });

        this.connection.on('close', () => {
          console.warn('[Notification-Consumer] Conexão encerrada. Tentando reconectar...');
          this.isConnected = false;
          setTimeout(() => this.start(), 5000);
        });

        return;
      } catch (err) {
        console.warn(`[Notification-Consumer] Erro ao inicializar consumidor: ${err.message}. Retentando em ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  // Processamento com confirmação manual (ACK) e encaminhamento para DLQ se houver falha (NACK)
  _processMessage(msg) {
    if (!msg) return;

    const routingKey = msg.fields.routingKey;
    try {
      const content = JSON.parse(msg.content.toString());
      console.log(`[Notification-Consumer] [RECEBIDO] [${routingKey}]:`, JSON.stringify(content));

      // Simulação de regra de negócio / notificações
      const eventRecord = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        routingKey,
        data: content,
        processedAt: new Date().toISOString(),
        status: 'PROCESSED'
      };

      // Mantém últimos 50 eventos
      this.receivedEvents.unshift(eventRecord);
      if (this.receivedEvents.length > 50) this.receivedEvents.pop();

      // Confirmação com sucesso
      this.channel.ack(msg);
    } catch (err) {
      console.error(`[Notification-Consumer] Erro ao processar mensagem [${routingKey}]. Enviando para DLQ:`, err.message);
      // NACK com requeue=false faz o RabbitMQ mover automaticamente para o Dead Letter Exchange!
      this.channel.nack(msg, false, false);
    }
  }

  _processDlqMessage(msg) {
    if (!msg) return;
    try {
      const content = msg.content.toString();
      const deathHeader = msg.properties.headers['x-death'];
      console.warn('[Notification-Consumer] [DLQ] Mensagem morta recebida:', content, 'x-death:', deathHeader);

      this.deadLetterEvents.unshift({
        content,
        deathHeader,
        arrivedAt: new Date().toISOString()
      });
      if (this.deadLetterEvents.length > 20) this.deadLetterEvents.pop();

      this.channel.ack(msg);
    } catch (err) {
      this.channel.ack(msg);
    }
  }

  getEvents() {
    return {
      totalReceived: this.receivedEvents.length,
      events: this.receivedEvents,
      deadLettersCount: this.deadLetterEvents.length,
      deadLetters: this.deadLetterEvents
    };
  }
}

module.exports = new EventConsumer();
