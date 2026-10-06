FROM node:20-alpine

WORKDIR /usr/src/app

# Copia manifests primeiro para aproveitar cache de camadas do Docker
COPY package*.json ./

RUN npm install --only=production

# Copia o código fonte
COPY . .

# Expõe a porta interna do microserviço
EXPOSE 4001

# Variáveis padrão
ENV PORT=4001 \
    NODE_ENV=production

# Healthcheck nativo do container
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/health || exit 1

CMD ["node", "src/server.js"]
