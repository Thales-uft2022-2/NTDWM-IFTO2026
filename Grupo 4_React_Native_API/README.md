# Grupo 3 e 4 — API e armazenamento no React Native

App didático para demonstrar API REST com `fetch`, loading/erros, AsyncStorage e hook customizado `useUsers`.

## Executar
1. Instale Node.js LTS.
2. Extraia e abra esta pasta no VS Code.
3. Rode:
   ```bash
   npm install
   npx expo start
   ```
4. Abra com Expo Go ou emulador Android.

## API usada
A configuração inicial usa `https://jsonplaceholder.typicode.com/users` para que o exemplo possa rodar imediatamente. **Para cumprir o requisito de consumir a API real do Capítulo 1, altere `src/config/api.js` para a URL do seu backend e ajuste `USERS_ENDPOINT` e o mapeamento dos dados conforme a resposta real.** Não é possível definir esse endereço sem conhecer a API criada pelo grupo.

## Testes
- Carregamento inicial e lista.
- Atualização com gesto de puxar para baixo.
- Falha de rede e botão de tentar novamente.
- Cache com AsyncStorage após uma carga bem-sucedida.
- Se a API estiver fora do ar, tenta exibir os últimos dados salvos.

## Arquitetura
- `src/config`: endpoint e timeout.
- `src/services`: requisições HTTP.
- `src/storage`: leitura/gravação local.
- `src/hooks`: lógica reutilizável.
- `src/components`: cartão de usuário.
- `src/screens`: interface.

**Nota:** não salve senhas, tokens ou dados sensíveis em AsyncStorage sem avaliar uma solução de armazenamento seguro.
