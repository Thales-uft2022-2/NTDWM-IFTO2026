CREATE DATABASE IF NOT EXISTS sistema_academico_monolitico
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sistema_academico_monolitico;

CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    curso VARCHAR(120) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    carga_horaria INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    disciplina_id INT NOT NULL,
    data_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY aluno_disciplina (aluno_id, disciplina_id),
    CONSTRAINT fk_matricula_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    CONSTRAINT fk_matricula_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE
);

INSERT IGNORE INTO alunos (id,nome,email,curso) VALUES
(1,'Aluno Exemplo','aluno@exemplo.com','Sistemas para Internet');

INSERT IGNORE INTO disciplinas (id,nome,carga_horaria) VALUES
(1,'Novas Tecnologias e Desenvolvimento Web e Mobile',60);

INSERT IGNORE INTO matriculas (id,aluno_id,disciplina_id) VALUES
(1,1,1);