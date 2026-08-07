🎓 Sistema Acadêmico Monolítico

Protótipo desenvolvido para a disciplina **Novas Tecnologias e Desenvolvimento Web e Mobile – IFTO**.

**Grupo 1 – Estudo de Sistemas Monolíticos**

O projeto apresenta, de forma prática, o funcionamento de uma **arquitetura monolítica**, utilizando um Sistema Acadêmico como estudo de caso.

---

## 📌 Sobre o projeto

Uma aplicação monolítica é desenvolvida e implantada como uma única unidade.

Neste protótipo, funcionalidades como:

- Cadastro de alunos;
- Cadastro de disciplinas;
- Matrículas;
- Dashboard;
- Regras de negócio;
- Acesso ao banco de dados;

fazem parte da mesma aplicação.

O sistema foi desenvolvido utilizando:

- PHP
- HTML5
- CSS3
- JavaScript
- MySQL
- XAMPP

---

# 🏫 Disciplina

## Novas Tecnologias e Desenvolvimento Web e Mobile

### 🎯 Objetivos da disciplina

A disciplina tem como objetivo proporcionar aos estudantes uma visão atualizada e prática das tecnologias de desenvolvimento **web e mobile**, enfatizando a arquitetura de microsserviços, frameworks modernos para front-end e ferramentas multiplataforma para aplicativos móveis.

Também busca formar profissionais capazes de **analisar, projetar, implementar e integrar sistemas distribuídos**, considerando aspectos como:

- Escalabilidade;
- Manutenção;
- Flexibilidade;
- Integração entre sistemas;
- Arquitetura de software.

Além disso, a disciplina busca estimular a **autonomia, o pensamento crítico e o trabalho em equipe**, utilizando metodologias ativas como:

- Sala de aula invertida;
- Seminários;
- Workshops;
- Atividades práticas.

Essas atividades são desenvolvidas conforme as diretrizes do **Projeto Pedagógico do Curso (PPC)**.

---

# 🧠 Competências e habilidades a serem desenvolvidas

## 🏗️ 1. Arquitetura de Software e Microsserviços

Ao longo da disciplina, os estudantes deverão desenvolver competências para:

- Analisar e comparar arquiteturas monolíticas e arquiteturas de microsserviços;
- Compreender as vantagens e limitações de cada arquitetura;
- Decompor sistemas em serviços especializados;
- Implantar microsserviços utilizando containers;
- Compreender estratégias de escalabilidade;
- Analisar desafios de comunicação entre serviços;
- Trabalhar conceitos relacionados a monitoramento e segurança.

O presente projeto está relacionado diretamente a este conteúdo, pois apresenta um exemplo prático de uma **aplicação monolítica**.

---

## 🌐 2. Frameworks Web e SPAs

A disciplina aborda frameworks modernos utilizados no desenvolvimento web, como:

- React;
- Angular;
- Vue.

Os estudantes deverão ser capazes de avaliar essas tecnologias considerando:

- Linguagem utilizada;
- Desempenho;
- Curva de aprendizado;
- Estrutura do framework;
- Aplicabilidade em diferentes projetos.

Também serão desenvolvidas **Single-Page Applications (SPAs)** capazes de:

- Consumir APIs;
- Implementar rotas;
- Gerenciar estados;
- Integrar front-end e back-end.

---

## 📱 3. Desenvolvimento Mobile Multiplataforma

A disciplina também trabalha o desenvolvimento de aplicativos móveis utilizando tecnologias multiplataforma, como:

- Flutter / Dart;
- React Native / JavaScript.

Entre as competências desenvolvidas estão:

- Desenvolvimento de aplicativos móveis;
- Navegação entre telas;
- Consumo de serviços REST;
- Armazenamento local;
- Acesso aos sensores do dispositivo;
- Compreensão das diferenças de arquitetura e renderização entre Flutter e React Native.

---

## 🔗 4. Integração Full-Stack e DevOps

Os estudantes deverão compreender como integrar diferentes componentes de uma aplicação moderna.

Entre os conteúdos estão:

- Integração entre front-end e back-end;
- Integração de aplicativos móveis;
- Integração com microsserviços;
- APIs REST;
- Containers;
- Pipelines de CI/CD;
- Práticas DevOps;
- Autenticação;
- Observabilidade;
- Implantação de sistemas distribuídos.

---

## 🔬 5. Pesquisa, inovação e competências transversais

A disciplina também incentiva a pesquisa sobre tecnologias emergentes e novas tendências do desenvolvimento de software.

Algumas tecnologias e conceitos que poderão ser estudados incluem:

- Svelte;
- Solid;
- Qwik;
- Micro-frontends;
- Novos frameworks web;
- Novas arquiteturas de software.

Também são trabalhadas competências como:

- Trabalho em equipe;
- Comunicação;
- Apresentação de resultados;
- Seminários;
- Workshops;
- Autonomia;
- Pensamento crítico;
- Pesquisa e inovação.

---

# 📊 Método de avaliação

A **Média Final** será composta pelas avaliações realizadas nos quatro capítulos da disciplina.

## MÉDIA 1

A Média 1 será calculada utilizando:

```text
MÉDIA 1 = (NOTA 1 + NOTA 2) / 2
```

### NOTA 1

Atividade avaliativa referente ao **Capítulo 1**.

### NOTA 2

Atividade avaliativa referente ao **Capítulo 2**.

---

## MÉDIA 2

A Média 2 será calculada utilizando:

```text
MÉDIA 2 = (NOTA 3 + NOTA 4) / 2
```

### NOTA 3

Atividade avaliativa referente ao **Capítulo 3**.

### NOTA 4

Atividade avaliativa referente ao **Capítulo 4**.

---

# 📚 Pré-requisitos da disciplina

Para essa disciplina existem dois pré-requisitos fundamentais:

> 🚀 **1. Ter vontade de aprender.**

> 💡 **2. Não ter medo de errar.**

A proposta da disciplina valoriza a experimentação, a prática e a aprendizagem durante o processo de desenvolvimento.

---

# 🏗️ Estudo de Sistemas Monolíticos

## O que é uma aplicação monolítica?

Uma aplicação monolítica é um sistema no qual as diferentes funcionalidades são desenvolvidas dentro de uma **única aplicação**.

Normalmente, interface, regras de negócio e acesso ao banco de dados são executados dentro do mesmo processo.

Neste protótipo temos:

```text
┌─────────────────────────────────────────┐
│              INTERFACE                  │
│                                         │
│ Página Inicial                          │
│ Dashboard                               │
│ Alunos                                  │
│ Disciplinas                             │
│ Matrículas                              │
│                                         │
│ HTML + CSS + JavaScript                 │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          LÓGICA DE NEGÓCIO              │
│                                         │
│ Cadastro                                │
│ Edição                                  │
│ Exclusão                                │
│ Matrículas                              │
│ Validações                              │
│                                         │
│ PHP                                     │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│            BANCO DE DADOS               │
│                                         │
│ alunos                                  │
│ disciplinas                             │
│ matriculas                              │
│                                         │
│ MySQL                                   │
└─────────────────────────────────────────┘
```

Todas essas camadas fazem parte do **mesmo sistema**.

---

# 🧩 Estudo de caso

Para demonstrar a arquitetura monolítica foi desenvolvido um **Sistema Acadêmico**.

O sistema possui os seguintes módulos:

### 👨‍🎓 Alunos

Permite:

- Cadastrar alunos;
- Listar alunos;
- Editar alunos;
- Excluir alunos.

### 📚 Disciplinas

Permite:

- Cadastrar disciplinas;
- Listar disciplinas;
- Editar disciplinas;
- Excluir disciplinas;
- Definir carga horária.

### 📝 Matrículas

Permite:

- Selecionar aluno;
- Selecionar disciplina;
- Realizar matrícula;
- Listar matrículas;
- Remover matrícula.

### 📊 Dashboard

Apresenta informações gerais do sistema, como:

- Quantidade de alunos;
- Quantidade de disciplinas;
- Quantidade de matrículas;
- Últimas matrículas realizadas.

---

# ✅ Vantagens da arquitetura monolítica

Entre as principais vantagens estão:

- Simplicidade inicial;
- Desenvolvimento rápido;
- Menor complexidade de infraestrutura;
- Facilidade de execução local;
- Facilidade para pequenos projetos;
- Implantação centralizada;
- Boa opção para protótipos;
- Boa opção para MVPs.

---

# ⚠️ Limitações da arquitetura monolítica

Conforme o sistema cresce, algumas dificuldades podem aparecer:

- Aumento do acoplamento entre módulos;
- Código cada vez maior;
- Manutenção mais complexa;
- Dificuldade para escalar apenas uma funcionalidade;
- Implantação conjunta de toda a aplicação;
- Maior possibilidade de conflitos entre equipes;
- Uma falha pode afetar diferentes partes da aplicação.

---

# 🎯 Quando utilizar uma arquitetura monolítica?

Uma arquitetura monolítica pode ser adequada para:

- Projetos acadêmicos;
- Projetos pequenos;
- MVPs;
- Protótipos;
- Sistemas internos;
- Startups em fase inicial;
- Equipes pequenas;
- Sistemas com requisitos simples de escalabilidade.

---

# 💻 Tecnologias utilizadas no protótipo

| Tecnologia | Utilização |
|---|---|
| PHP | Back-end e regras de negócio |
| HTML5 | Estrutura das páginas |
| CSS3 | Interface e responsividade |
| JavaScript | Interatividade |
| MySQL | Banco de dados |
| PDO | Comunicação PHP/MySQL |
| XAMPP | Ambiente local |

---

# 📂 Estrutura do projeto

```text
prototipo_monolitico_sistema_academico/
│
├── index.php
├── dashboard.php
├── arquitetura.php
├── banco.sql
│
├── partials_header.php
├── partials_footer.php
│
├── config/
│   └── database.php
│
├── alunos/
│   └── index.php
│
├── disciplinas/
│   └── index.php
│
├── matriculas/
│   └── index.php
│
└── assets/
    ├── css/
    │   └── style.css
    │
    └── js/
        └── script.js
```

---

# 🚀 Como executar no XAMPP

Coloque o projeto em:

```text
C:\xampp\htdocs\NTDWM-IFTO2026\grupo1\prototipo_monolitico_sistema_academico
```

Abra o **XAMPP Control Panel** e inicie:

```text
Apache
MySQL
```

Depois importe o arquivo:

```text
banco.sql
```

pelo **phpMyAdmin**.

Após a configuração, acesse o sistema pelo navegador através do endereço local correspondente à pasta do projeto.

---

# 📌 Conclusão

O protótipo demonstra de maneira prática como funciona uma **arquitetura monolítica**.

Apesar de possuir diferentes módulos, como alunos, disciplinas e matrículas, todos estão integrados dentro de uma única aplicação, compartilhando a mesma lógica de execução e o mesmo banco de dados.

Essa abordagem oferece simplicidade e rapidez no início do desenvolvimento, sendo adequada para projetos pequenos, protótipos e MVPs. Entretanto, conforme a aplicação cresce, questões relacionadas à escalabilidade, manutenção e independência dos componentes tornam-se mais relevantes.

O estudo da arquitetura monolítica também fornece uma base importante para posteriormente comparar esse modelo com a **arquitetura de microsserviços**, um dos principais conteúdos da disciplina de **Novas Tecnologias e Desenvolvimento Web e Mobile**.