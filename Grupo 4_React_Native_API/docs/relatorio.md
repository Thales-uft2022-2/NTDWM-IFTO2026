# Relatório — Integração de API e armazenamento local no React Native

**Grupo:** 3 e 4  
**Aluno(s):** [preencher]  
**Disciplina:** [preencher]  
**Instituição:** [preencher]

## 1. Objetivo
O objetivo é demonstrar a integração de uma aplicação React Native com uma API REST, usando `fetch`, tratamento de falhas e carregamento, armazenamento local com AsyncStorage e organização modular com hooks customizados. A atividade também compara React Native e Flutter.

## 2. Integração com API
O projeto possui um serviço separado (`src/services/usersService.js`) que envia uma requisição GET ao endpoint de usuários. Para que a demonstração seja executável sem depender do backend do grupo, o exemplo usa a API pública JSONPlaceholder (`https://jsonplaceholder.typicode.com/users`). **Para a entrega final, recomenda-se trocar a URL pela API real do Capítulo 1**, conforme as instruções em `src/config/api.js`, e ajustar o caminho e o formato dos dados caso sejam diferentes.

A função `fetchUsers` verifica `response.ok`, interpreta o JSON, valida que a resposta seja uma lista e trata erros HTTP, falhas de conexão e tempo limite. A tela apresenta um indicador de carregamento e uma opção para tentar novamente.

## 3. Armazenamento local
AsyncStorage salva os dados recebidos da API como JSON sob uma chave versionada. Se a requisição falhar, o hook tenta recuperar o último conjunto de dados salvo e informa que está mostrando o cache. AsyncStorage é apropriado para preferências e dados pequenos não sensíveis; não deve armazenar senhas ou segredos. Para grandes volumes ou consultas relacionais, pode ser mais adequado usar SQLite.

## 4. Estrutura modular e hook customizado
A organização separa configuração (`config`), serviço de rede (`services`), persistência (`storage`), hook (`hooks`), componentes reutilizáveis (`components`) e tela (`screens`). O hook `useUsers` centraliza estados de carregamento, atualização, erro, origem dos dados e a função de recarga. Isso evita misturar toda a lógica de rede diretamente na interface.

## 5. React Native e Flutter
**React Native — vantagens:** usa JavaScript/TypeScript e conceitos de React; facilita reaproveitar conhecimento e lógica do ecossistema web; possui ampla variedade de bibliotecas. **Limitações:** dependências nativas e compatibilidade de versões podem exigir configuração; algumas bibliotecas precisam de código nativo e o desempenho depende da arquitetura e da implementação.

**Flutter — vantagens:** usa Dart e oferece um conjunto integrado de widgets, renderização consistente entre plataformas e ferramentas de desenvolvimento coesas. **Limitações:** exige aprender Dart; a integração com bibliotecas e código existentes em JavaScript pode ser menos direta; o tamanho inicial do aplicativo e a forma de integração com APIs nativas precisam ser considerados.

**Comparação do fluxo de integração:** em React Native, o desenvolvedor usa `fetch`/Axios, hooks e bibliotecas como AsyncStorage; em Flutter, normalmente usa o pacote `http`/Dio, `Future`/`async-await`, widgets com `FutureBuilder` ou gerenciamento de estado e pacotes de armazenamento local. Ambos conseguem consumir a mesma API HTTP. A escolha depende da experiência da equipe, requisitos de UI, ecossistema e manutenção.

## 6. Conclusão
O projeto demonstra chamada HTTP, estado de carregamento, tratamento de falhas, cache local e separação de responsabilidades. A API pública é usada como fallback didático; para atender estritamente ao enunciado, a versão final deve apontar para o endpoint real do Capítulo 1 e ser testada com esse serviço.

## Referências
- JSONPlaceholder. Fake Online REST API for Testing and Prototyping. https://jsonplaceholder.typicode.com/
- React Native. Networking. https://reactnative.dev/docs/network
- React Native Async Storage. Documentation. https://react-native-async-storage.github.io/async-storage/
- Flutter. Fetch data from the internet. https://docs.flutter.dev/cookbook/networking/fetch-data
