# ADR-0001: Stack mobile para catálogo + pedidos de loja de roupas local

## Status

`Aceito`

**Data:** 2026-10-05
**Autor:** João Pedro Correia Barros

## Contexto

- **Produto:** app pra uma loja de roupas local exibir o catálogo (fotos, tamanhos, cores, estoque) e receber pedidos com retirada na loja ou entrega no bairro; notificações push para novidades e status do pedido
- **Escala alvo:** 1 loja, algumas centenas de clientes ativos, catálogo de poucas centenas de produtos
- **Time:** 3 devs, todos com background JavaScript/web (React), sem experiência mobile nativa
- **Restrição:** lançar em **2 meses** nas lojas (Android e iOS); orçamento de loja pequena, sem espaço pra contratar especialista mobile
- **Não pode dar errado:** fluxo de pedido (carrinho → checkout) e imagens do catálogo carregando rápido em 4G

## Decisão

Adotaremos **React Native com Expo** (TypeScript), aproveitando o conhecimento de JS/React do time e publicando um único código em Android e iOS.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| **React Native + Expo** (escolhida) | Mesma linguagem e modelo mental (React/JSX) que o time já domina; 1 codebase pra Android e iOS; Expo simplifica build (EAS), push notifications e atualizações OTA; ecossistema npm enorme | Camada extra sobre o nativo — eventual módulo nativo exige aprender Kotlin/Swift; dependência do ciclo de versões do Expo/RN |
| PWA | Zero curva de aprendizado (é web pura); deploy instantâneo sem loja; menor custo | Push no iOS só funciona com o app instalado na tela inicial (iOS 16.4+) e a descoberta é ruim; sem presença na App Store/Play Store, que a loja quer como vitrine |
| Flutter | Ótima performance e UI consistente entre plataformas; hot reload; doc oficial excelente | Exige aprender Dart e um novo paradigma de widgets — curva incompatível com prazo de 2 meses pra um time 100% JS |
| Nativo (Kotlin + Swift) | Melhor performance e acesso total às APIs de cada plataforma | 2 codebases e 2 linguagens novas pra 3 devs web — inviável em 2 meses |

## Consequências

**Positivas:**
- Time produtivo desde a 1ª semana: reaproveita React, TypeScript, bibliotecas de estado (ex.: Zustand/React Query) e até lógica de validação do site da loja, se houver
- Expo (EAS Build/Submit) evita configurar Xcode/Android Studio manualmente e acelera a publicação nas lojas; correções pequenas saem via update OTA sem nova revisão
- Push notifications e câmera/galeria (fotos de produto) cobertas por módulos prontos do Expo

**Negativas:**
- Revisão da App Store pode atrasar o lançamento — reservar ~1 semana de folga no cronograma
- Listas grandes com muitas imagens exigem cuidado de performance (usar `FlatList`/`FlashList` e cache de imagem), algo novo pra quem vem da web
- Se surgir necessidade de integração nativa específica (ex.: SDK de pagamento sem suporte Expo), será preciso usar *development build* e possivelmente escrever código nativo — revisar este ADR nesse caso

## Referências

- React Native — documentação oficial. Meta Open Source. https://reactnative.dev/docs/getting-started
- Expo — documentação oficial (EAS Build, Notifications, Updates). https://docs.expo.dev
- Peal, G. (2018). *React Native at Airbnb* (série de 5 posts, incl. *Sunsetting React Native*). Airbnb Engineering & Data Science. https://medium.com/airbnb-engineering/react-native-at-airbnb-f95aa460be1c — relata ganhos de compartilhamento de código e os custos de integração brownfield com nativo, que aqui são mitigados por ser um app greenfield e 100% RN
- Charland, A.; Leroux, B. (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), 49–53.
- Nygard, M. (2011). *Documenting Architecture Decisions*. Cognitect Blog — formato ADR usado aqui.
