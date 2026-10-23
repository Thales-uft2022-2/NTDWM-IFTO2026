# Relatório — Navegação e gerenciamento de estado no React Native

## 1. Introdução
Aplicações móveis precisam apresentar telas, responder às interações e compartilhar informações entre componentes. No React, o estado representa dados que podem mudar durante a execução e cuja alteração pode provocar uma nova renderização da interface. Este trabalho apresenta um exemplo prático de navegação e gerenciamento de estado em React Native.

## 2. Estado e hooks
O estado local pertence a um componente e é indicado quando a informação só é relevante naquele contexto, como o texto digitado em um campo ou um contador. O estado compartilhado/global é necessário quando vários componentes precisam consultar ou alterar a mesma informação, como o usuário autenticado.

`useState` cria estado local e fornece uma função para atualizá-lo. A atualização solicita uma nova renderização; não se deve modificar diretamente o valor anterior. `useEffect` permite executar efeitos colaterais após renderizações, por exemplo registrar eventos, buscar dados ou sincronizar com um serviço externo. As dependências definem quando o efeito deve ser executado; um array vazio representa, em geral, o ciclo de montagem e desmontagem do componente. `useContext` permite ler um valor oferecido por um Context Provider sem repassar props por muitos níveis.

## 3. Navegação
React Navigation é uma biblioteca popular de navegação para React Native. O Stack Navigator organiza telas em uma pilha: navegar para uma tela normalmente adiciona uma rota; voltar remove a rota superior e revela a anterior; substituir troca a rota atual por outra. O Tab Navigator apresenta destinos paralelos, geralmente por uma barra inferior, como Início e Perfil.

Neste projeto, o Stack Navigator apresenta Login quando não há usuário. Depois que o contexto recebe um usuário, a árvore de navegação muda para a área autenticada, composta por abas. A ação de sair limpa o usuário, fazendo o fluxo voltar ao Login. A navegação, portanto, responde ao estado de autenticação em vez de depender apenas de uma mudança visual.

## 4. Context API no projeto
`AuthProvider` guarda o objeto `user` em `useState` e oferece `user`, `signIn` e `signOut` por meio de `AuthContext.Provider`. Login chama `signIn`; Dashboard e Perfil leem os mesmos dados por `useContext`; Perfil chama `signOut`. Isso demonstra compartilhamento real entre telas.

A Context API é adequada quando o estado compartilhado é pequeno e relativamente simples. Não exige uma biblioteca externa de estado e já integra o React. Entretanto, alterações no valor do Provider podem renderizar novamente os consumidores. Por isso, deve-se evitar colocar dados não relacionados em um único contexto amplo.

## 5. Comparação de soluções
**Context API:** indicada para estado compartilhado simples, como tema, idioma ou autenticação. Vantagens: nativa, direta e sem dependência extra. Limitações: não é, por si só, uma solução completa de cache, persistência ou ferramentas avançadas de depuração; atualizações frequentes podem causar renderizações desnecessárias.

**Redux Toolkit:** indicado para estado global complexo, regras de atualização centralizadas, fluxos assíncronos elaborados e equipes que precisam de padrões e ferramentas de depuração. Vantagens: previsibilidade, ecossistema maduro e Redux DevTools. Limitações: configuração e conceitos adicionais, mesmo com Redux Toolkit simplificando o uso.

**Zustand:** indicado quando se deseja uma store global simples, com pouca estrutura e seletores por componente. Vantagens: API enxuta e possibilidade de assinar apenas partes do estado. Limitações: exige dependência externa e decisões próprias sobre organização, persistência e padrões da equipe.

**Recoil:** foi criado para estado compartilhado dividido em átomos e seletores derivados. O projeto Recoil foi arquivado e não deve ser a escolha padrão para novos projetos sem uma avaliação cuidadosa de manutenção e compatibilidade. Em novos aplicativos, avalie alternativas mantidas, como Context API, Zustand ou Redux Toolkit.

| Critério | Context API | Redux Toolkit | Zustand | Recoil |
|---|---|---|---|---|
| Complexidade inicial | Baixa | Média | Baixa | Média |
| Dependência adicional | Não | Sim | Sim | Sim |
| Estado complexo | Possível, mas pode ficar difícil de organizar | Forte adequação | Adequado em muitos casos | Modelo por átomos |
| Atualização seletiva | Limitada sem técnicas adicionais | Seletores | Seletores simples | Átomos/seletores |
| Ecossistema/manutenção | React | Maduro | Ativo; verificar versão | Projeto arquivado |
| Uso neste exemplo | **Escolhido** | Exagero para o escopo | Alternativa viável, não necessária | Não recomendado para novo projeto |

## 6. Escolha arquitetural e desempenho
A Context API foi escolhida porque o aplicativo tem poucas telas e apenas um estado global central: o usuário demonstrativo. Ela permite mostrar claramente onde o estado vive e como é compartilhado. Redux Toolkit poderia ser útil em um sistema maior, com muitos domínios, fluxos complexos e necessidade de depuração centralizada. Zustand seria uma opção compacta se surgissem várias stores e atualizações frequentes. Recoil não foi escolhido, inclusive pela situação de manutenção do projeto.

Para reduzir renderizações desnecessárias, o exemplo usa `useMemo` para memorizar o objeto do Provider e `useCallback` para manter estáveis as funções `signIn` e `signOut`. Em sistemas maiores, é possível separar contextos por domínio, dividir componentes, selecionar apenas os dados necessários e evitar colocar estados que mudam frequentemente no mesmo Provider. Memoização ajuda, mas deve ser orientada por medição e não substitui uma arquitetura adequada.

## 7. Conclusão
O aplicativo demonstra navegação condicional com Stack Navigator, abas com Tab Navigator e compartilhamento do usuário autenticado por Context API. Os hooks são usados em situações práticas e a comparação mostra que a melhor solução depende da complexidade, da frequência das atualizações, das necessidades de depuração e da manutenção. Para este exemplo didático, a Context API atende ao requisito com menor complexidade.

## Referências
- REACT. **Built-in React Hooks**. Disponível em: https://react.dev/reference/react. Acesso em: 22 out. 2026.
- REACT NAVIGATION. **React Navigation documentation**. Disponível em: https://reactnavigation.org/docs/getting-started. Acesso em: 22 out. 2026.
- REACT REDUX. **Redux Toolkit**. Disponível em: https://redux-toolkit.js.org/. Acesso em: 22 out. 2026.
- ZUSTAND. **Zustand documentation**. Disponível em: https://zustand.docs.pmnd.rs/. Acesso em: 22 out. 2026.
- RECOIL. **Recoil repository**. Disponível em: https://github.com/facebookexperimental/Recoil. Acesso em: 22 out. 2026.
