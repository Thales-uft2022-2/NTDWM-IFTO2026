CREATE DATABASE IF NOT EXISTS usuarios_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS academico_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON usuarios_db.* TO 'academico'@'%';
GRANT ALL PRIVILEGES ON academico_db.* TO 'academico'@'%';
FLUSH PRIVILEGES;

USE usuarios_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil ENUM('ADMIN', 'ALUNO') NOT NULL DEFAULT 'ALUNO',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

USE academico_db;

CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  matricula VARCHAR(40) NOT NULL UNIQUE,
  curso VARCHAR(120) NOT NULL,
  email VARCHAR(160),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disciplinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  carga_horaria INT NOT NULL,
  professor VARCHAR(120),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matriculas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  disciplina_id INT NOT NULL,
  semestre VARCHAR(20) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_matricula_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_matricula_disciplina
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
    ON DELETE CASCADE,
  CONSTRAINT uk_matricula UNIQUE (aluno_id, disciplina_id, semestre)
);

INSERT IGNORE INTO alunos (nome, matricula, curso, email) VALUES
('Ana Souza', '2026001', 'Sistemas para Internet', 'ana@ifto.edu.br'),
('Carlos Lima', '2026002', 'Sistemas para Internet', 'carlos@ifto.edu.br');

INSERT IGNORE INTO disciplinas (nome, codigo, carga_horaria, professor) VALUES
('Novas Tecnologias de Desenvolvimento Web e Mobile', 'NTDWM', 60, 'Professor IFTO'),
('Estrutura de Dados', 'ED', 60, 'Professor IFTO'),
('Programação Científica', 'PC', 60, 'Professor IFTO');

INSERT IGNORE INTO matriculas (aluno_id, disciplina_id, semestre)
SELECT a.id, d.id, '2026.2'
FROM alunos a
JOIN disciplinas d ON d.codigo = 'NTDWM'
WHERE a.matricula = '2026001';
