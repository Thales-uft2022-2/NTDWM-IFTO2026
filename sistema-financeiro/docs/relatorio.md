# Relatório — Sistema Financeiro Pessoal

**Disciplina:** Novas Tecnologias para Desenvolvimento Web e Mobile (NTDWB)  
**Aluno:** [Nome do aluno]  
**Instituição:** [Instituição de ensino]  
**Data:** [Data de entrega]

## 1. Introdução

Este projeto tem como objetivo desenvolver uma aplicação web para auxiliar no controle financeiro pessoal, permitindo registrar receitas e despesas, consultar lançamentos e visualizar o saldo calculado a partir das movimentações cadastradas. A atividade integra conceitos de desenvolvimento de APIs REST, interface web, banco de dados, conteinerização e implantação.

## 2. Tecnologias utilizadas

O front-end foi desenvolvido com React e Vite, responsáveis pela interface e pelas chamadas HTTP à API. O back-end utiliza Node.js e Express para expor endpoints REST que recebem e retornam dados no formato JSON. O MySQL armazena usuários e transações de forma persistente. A autenticação utiliza senhas com hash bcrypt e tokens JWT para proteger as rotas de transações. Docker e Docker Compose permitem executar os serviços em contêineres separados.

## 3. Implementação e integração

A aplicação oferece cadastro e login de usuários, inclusão e consulta de receitas e despesas, cálculo de totais e exclusão de lançamentos. A API implementa métodos HTTP coerentes com as operações: GET para consulta, POST para criação e DELETE para exclusão. As transações são associadas ao usuário autenticado, evitando que um usuário consulte ou exclua registros de outro usuário por meio das rotas implementadas.

O diagrama de arquitetura descreve a comunicação entre o navegador, o front-end React servido pelo Nginx, a API Express e o banco MySQL. O Docker Compose coordena os serviços e cria um volume para preservar os dados do banco quando os contêineres são recriados.

## 4. Desafios enfrentados

Entre os principais desafios estão configurar a comunicação entre contêineres, definir as variáveis de ambiente, aguardar a disponibilidade do banco de dados e tratar respostas de erro da API. Também é necessário configurar corretamente a URL da API e as variáveis de ambiente no ambiente de publicação. Esses pontos reforçam a importância de separar configuração e código, validar os dados recebidos e testar cada camada antes de integrar o sistema completo.

**Preencher após os testes:** registrar os erros realmente encontrados, como foram resolvidos e evidências dos testes de cadastro, login, consulta e inclusão de transações.

## 5. Lições aprendidas e conclusão

O projeto demonstra como uma interface web pode consumir uma API REST e como os serviços podem ser organizados em contêineres. A separação entre front-end, back-end e banco de dados facilita manutenção e evolução. A atividade também evidencia que a publicação exige atenção a segredos, persistência, conectividade e configuração do ambiente. Como evolução futura, podem ser adicionados filtros por período, edição de transações, exportação de relatórios e testes automatizados.

**Nota:** atualizar este relatório com o nome do aluno, a instituição, as evidências dos testes e o endereço real da aplicação publicada. Não declarar implantação concluída antes de executá-la e verificá-la.
