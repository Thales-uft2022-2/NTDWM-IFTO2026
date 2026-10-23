# StateFlow — Navegação e gerenciamento de estado no React Native

Projeto acadêmico demonstrando React Navigation, Stack Navigator, Tab Navigator, `useState`, `useEffect`, `useContext` e Context API.

## Requisitos
- Node.js LTS instalado
- Expo Go no celular ou emulador Android configurado

## Como executar
1. Extraia o ZIP e abra a pasta `StateFlow_React_Native` no VS Code.
2. No terminal, execute `npm install`.
3. Execute `npx expo start`.
4. Escaneie o QR Code com o Expo Go ou pressione `a` para abrir no emulador Android.

## Fluxo do aplicativo
- Sem usuário autenticado: o Stack Navigator apresenta Login.
- Ao informar nome e e-mail válidos, `signIn` atualiza o estado `user` no AuthContext.
- O RootNavigator observa esse estado e apresenta as abas do aplicativo.
- Dashboard e Perfil leem o mesmo usuário por `useContext`.
- Ao tocar em “Sair da conta”, `signOut` limpa o estado e a tela Login volta a ser apresentada.

## Credenciais
Não há senha nem servidor. Informe qualquer nome e um e-mail em formato válido, por exemplo `aluno@exemplo.com`. **A autenticação é apenas demonstrativa e não deve ser usada em produção.**

## Estrutura
```text
StateFlow_React_Native/
├── App.js
├── package.json
├── src/
│   ├── context/AuthContext.js
│   ├── navigation/RootNavigator.js
│   ├── navigation/MainTabs.js
│   └── screens/
│       ├── LoginScreen.js
│       ├── DashboardScreen.js
│       └── ProfileScreen.js
└── docs/
    ├── relatorio.md
    └── roteiro_apresentacao.md
```

## Conceitos demonstrados
- `useState`: nome/e-mail no Login e contador no Dashboard.
- `useEffect`: registro de montagem da tela e reação à mudança do contador.
- `useContext`: leitura de `user`, `signIn` e `signOut` em componentes diferentes.
- Context API: mantém o estado de autenticação no `AuthProvider`.
- `useMemo` e `useCallback`: reduzem a recriação desnecessária do valor e das funções de contexto.
- Stack Navigator: alterna o fluxo Login ↔ área autenticada.
- Tab Navigator: alterna Dashboard e Perfil.

## Limitações
Este projeto demonstra estado em memória. Ao fechar/reiniciar o app, o usuário não permanece autenticado. Um sistema real exigiria backend, autenticação segura, armazenamento adequado de credenciais/tokens e tratamento de erros.
