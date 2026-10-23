# Roteiro de apresentação (5–7 minutos)

1. **Objetivo:** “O trabalho mostra como um app React Native consome uma API, lida com erros e mantém uma cópia local dos dados.”
2. **Estrutura:** mostre `config/api.js`, `services/usersService.js`, `storage/usersStorage.js`, `hooks/useUsers.js` e a tela.
3. **API:** explique a requisição GET, `response.ok`, conversão JSON e os erros de rede/HTTP/timeout.
4. **Loading e erros:** execute o app, mostre o indicador de carregamento e explique a opção de tentar novamente.
5. **AsyncStorage:** explique que os dados bem-sucedidos são salvos localmente e podem ser exibidos como cache se a API estiver indisponível.
6. **Hook customizado:** mostre como `useUsers` encapsula `users`, `loading`, `refreshing`, `error`, `source` e `reload`.
7. **React Native × Flutter:** React Native usa JavaScript/React e fetch/AsyncStorage; Flutter usa Dart, Future/async e pacotes como http e armazenamento local. Ambos acessam APIs REST.
8. **Fechamento:** enfatize que JSONPlaceholder é o endpoint demonstrativo. Para cumprir integralmente o enunciado, configurar a URL real do Capítulo 1 e testar a resposta do backend.

## Testes para demonstrar
- Com internet: carregar lista de usuários.
- Puxar a lista para baixo: atualizar os dados.
- Desligar a internet depois de uma carga bem-sucedida e recarregar: o app deve tentar mostrar o cache local.
- Restaurar a internet e tentar novamente.
