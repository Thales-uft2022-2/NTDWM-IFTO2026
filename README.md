# 🎓 NTDWM-IFTO2026 — Novas Tecnologias e Desenvolvimento Web e Mobile

Repositório acadêmico da disciplina **Novas Tecnologias e Desenvolvimento Web e Mobile**, do IFTO. Reúne estudos, protótipos e atividades sobre arquitetura de software, desenvolvimento web, aplicações multiplataforma e integração de sistemas.

## 📌 Projetos e conteúdos

### 📱 TaskFlow — aplicativo Flutter

Aplicativo de gerenciamento de tarefas desenvolvido com **Flutter e Dart**. A aplicação utiliza uma estrutura separada por responsabilidades e é executada atualmente no navegador com Flutter Web.

**Funcionalidades presentes na interface:**
- Tela principal de tarefas;
- Ação para adicionar tarefas;
- Exibição de estado vazio quando não há tarefas cadastradas.

> Observação: a persistência dos dados, a edição e a conclusão de tarefas dependem da implementação existente nos arquivos do projeto. Não presuma que os dados ficam salvos após fechar o aplicativo.

**Tecnologias:** Flutter, Dart, Material 3 e Flutter Web.

### 🏫 Grupo 1 — Sistema Acadêmico Monolítico

Protótipo de estudo que demonstra uma aplicação monolítica para gerenciamento acadêmico. A proposta reúne interface, regras de negócio e acesso ao banco de dados em uma única aplicação.

Módulos descritos no projeto:
- Cadastro, listagem, edição e exclusão de alunos;
- Cadastro e gerenciamento de disciplinas;
- Matrículas de alunos em disciplinas;
- Dashboard com indicadores gerais.

**Tecnologias previstas no protótipo:** PHP, HTML5, CSS3, JavaScript, MySQL, PDO e XAMPP.

### 📚 Apresentações e atividades

A pasta `Apresentacoes/` reúne materiais de apoio produzidos para os trabalhos da disciplina, incluindo apresentações sobre Flutter e React Native, conforme os arquivos existentes no repositório.

## 🧱 Estrutura do projeto

A estrutura principal inclui:

```text
NTDWM-IFTO2026/
├── Apresentacoes/
├── lib/
│   ├── controllers/
│   ├── models/
│   ├── views/
│   ├── widgets/
│   └── main.dart
├── sistema-financeiro/
├── pubspec.yaml
├── pubspec.lock
└── README.md
```

- `lib/`: código Dart da aplicação Flutter.
- `lib/main.dart`: ponto de entrada do TaskFlow.
- `lib/controllers/`: área destinada à lógica de controle.
- `lib/models/`: área destinada aos modelos de dados.
- `lib/views/`: telas da aplicação.
- `lib/widgets/`: componentes reutilizáveis.
- `pubspec.yaml`: configuração do projeto e dependências Flutter.
- `Apresentacoes/`: materiais de apresentação.

> A estrutura pode variar conforme novas atividades e projetos forem adicionados ao repositório.

## ⚙️ Requisitos para executar o TaskFlow

- Flutter SDK instalado e configurado no PATH;
- Google Chrome instalado para executar a versão Web;
- Git (opcional, para versionamento).

Verifique a instalação:

```powershell
flutter --version
flutter doctor
```

## 🚀 Como executar o TaskFlow no Chrome

Abra o PowerShell na raiz do repositório:

```powershell
cd C:\xampp\htdocs\NTDWM-IFTO2026
```

Baixe/resolva as dependências:

```powershell
flutter pub get
```

Execute a aplicação no Chrome:

```powershell
flutter run -d chrome
```

Mantenha o terminal aberto enquanto estiver executando a aplicação. Para encerrar, pressione `Ctrl + C` no terminal.

### Executar em outros destinos

Para listar os dispositivos disponíveis:

```powershell
flutter devices
```

O suporte Android exige a instalação e configuração do Android Studio e do Android SDK. O suporte Windows depende das ferramentas de compilação do Visual Studio.

## 🖥️ Executar o protótipo PHP/MySQL pelo XAMPP

Se for trabalhar com o protótipo do Sistema Acadêmico Monolítico:

1. Coloque a pasta do protótipo dentro de `C:\xampp\htdocs\`.
2. Abra o XAMPP Control Panel e inicie **Apache** e **MySQL**.
3. Importe o arquivo SQL do projeto pelo phpMyAdmin, se disponível.
4. Acesse no navegador o endereço local correspondente à pasta do protótipo.

Consulte os arquivos do próprio protótipo para confirmar a pasta exata e o nome do script SQL.

## 🧠 Conteúdos abordados na disciplina

- Arquitetura monolítica e microsserviços;
- Frameworks web e Single-Page Applications (SPAs);
- Desenvolvimento mobile multiplataforma com Flutter/Dart e React Native/JavaScript;
- APIs REST e integração entre front-end e back-end;
- Containers, DevOps, CI/CD, autenticação e observabilidade;
- Pesquisa, inovação, comunicação e trabalho em equipe.

## 🏗️ Arquitetura monolítica — resumo

Uma aplicação monolítica é desenvolvida e implantada como uma única unidade. No estudo de caso acadêmico, interface, lógica de negócio e acesso ao banco de dados pertencem à mesma aplicação.

**Vantagens:** simplicidade inicial, desenvolvimento rápido, infraestrutura menos complexa e facilidade de implantação em projetos pequenos.

**Limitações:** aumento do acoplamento, manutenção mais difícil conforme o sistema cresce e necessidade de implantar a aplicação como um todo.

## 📊 Avaliação da disciplina

Conforme a organização descrita para a disciplina:

```text
MÉDIA 1 = (NOTA 1 + NOTA 2) / 2
MÉDIA 2 = (NOTA 3 + NOTA 4) / 2
```

- Nota 1: atividade referente ao Capítulo 1.
- Nota 2: atividade referente ao Capítulo 2.
- Nota 3: atividade referente ao Capítulo 3.
- Nota 4: atividade referente ao Capítulo 4.

## 🎯 Objetivo do repositório

Organizar os estudos e protótipos desenvolvidos na disciplina, documentar como executar os projetos e registrar a evolução das atividades acadêmicas.

---

**Instituição:** Instituto Federal do Tocantins (IFTO)  
**Disciplina:** Novas Tecnologias e Desenvolvimento Web e Mobile
