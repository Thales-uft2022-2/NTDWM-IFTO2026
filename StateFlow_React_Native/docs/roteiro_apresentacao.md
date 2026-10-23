# Roteiro de apresentação oral (5–7 minutos)

## Slide 1 — Tema (20 s)
“Nosso trabalho demonstra navegação e gerenciamento de estado em React Native. Criamos o StateFlow, um aplicativo simples com Login, Dashboard e Perfil.”

## Slide 2 — O que é estado? (35 s)
“Estado são dados que mudam ao longo da execução e influenciam a interface. Estado local é usado por um componente; estado global é compartilhado por várias partes do aplicativo.”

## Slide 3 — Hooks (45 s)
“useState guarda valores mutáveis, como campos do Login e o contador. useEffect executa efeitos após renderizações, respeitando suas dependências. useContext lê dados fornecidos por um Provider sem precisar passar props por toda a árvore.”

## Slide 4 — Navegação (40 s)
“React Navigation oferece diferentes modelos. Stack organiza telas em uma pilha. Navegar normalmente adiciona uma tela, voltar remove a tela superior e substituir troca a rota atual. Tab Navigator permite alternar destinos como Início e Perfil.”

## Slide 5 — Arquitetura (35 s)
“O AuthProvider envolve a aplicação. Ele armazena o usuário e expõe as ações de entrar e sair. O RootNavigator verifica se existe usuário: sem usuário mostra Login; com usuário apresenta a área com abas.”

## Slide 6 — Demonstração (60–90 s)
“Vou digitar nome e e-mail. Ao entrar, o estado é atualizado no Context e o aplicativo mostra o Dashboard. O nome e e-mail são exibidos porque a tela consome o mesmo contexto. No Dashboard, o botão incrementa um estado local. Na aba Perfil, vou sair; o usuário é apagado e o app volta ao Login.”

## Slide 7 — Context API (35 s)
“A Context API é suficiente para este projeto porque temos poucas telas e um estado compartilhado simples. Não precisamos introduzir uma store externa só para compartilhar nome e e-mail.”

## Slide 8 — Comparação (50 s)
“Redux Toolkit é interessante para estado complexo, padrões centralizados e depuração. Zustand oferece uma store simples e seletores. Recoil usa átomos e seletores, mas seu repositório foi arquivado; não é a opção padrão para um projeto novo. As ferramentas devem ser escolhidas conforme o problema.”

## Slide 9 — Performance (35 s)
“Um contexto amplo pode causar renderizações extras nos consumidores. Usamos useMemo e useCallback para estabilizar o valor e as funções do contexto. Em projetos maiores, podemos separar contextos e componentes e medir o desempenho.”

## Slide 10 — Conclusão (20 s)
“Concluímos que a arquitetura escolhida atende ao escopo, demonstra os hooks e mantém o fluxo de autenticação simples. O login é apenas demonstrativo e não substitui autenticação real com servidor.”

## Perguntas que podem surgir
- **O login é real?** Não. É uma simulação local para demonstrar estado e navegação.
- **Por que não Redux?** O escopo tem pouco estado global; Redux acrescentaria estrutura sem benefício proporcional.
- **O que faz o app voltar ao Login?** `signOut` define `user` como `null`; o RootNavigator passa a renderizar a rota Login.
- **Context API evita todas as renderizações extras?** Não. Consumidores podem renderizar quando o valor do contexto muda; separar contextos, usar seletores ou memoização pode ajudar.
- **Qual a diferença entre estado local e global?** Local é relevante a um componente; global/shared é consumido por partes diferentes da árvore.
