CREATE DATABASE IF NOT EXISTS sistema_financeiro
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_financeiro;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('receita', 'despesa') NOT NULL,
  descricao VARCHAR(180) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data DATE NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transacoes_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_transacoes_usuario_data (usuario_id, data)
);
