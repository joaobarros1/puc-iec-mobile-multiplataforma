# README — Atividade 2 — João Pedro Correia Barros

## Identificação

- **Aluno:** João Pedro Correia Barros
- **Opção Reanimated escolhida:** A — heart pop
- **Bonus implementado:** TanStack Query com `staleTime` (5 min na lista) · Hermes (padrão do Expo SDK 54)
- **Repo (seu fork):** https://github.com/joaobarros1/puc-iec-mobile-multiplataforma

## Como rodar

```bash
cd exercicios/02-app-rn-navegacao-estado/joao-barros
npm install
cp .env.example .env   # preencher EXPO_PUBLIC_TMDB_TOKEN
npx expo start
```

Testes:

```bash
npm test   # 11 testes (4 counter + 7 favorites)
```

> ⚠️ MMKV é módulo nativo: pra persistir de verdade no iOS/Android use um development build
> (`npx expo run:android` / `npx expo run:ios`). No Expo Go o app roda, mas os favoritos ficam
> só em memória. Na web (`w`) a persistência usa `localStorage`.

## O que o app faz

Lista os filmes populares da TMDB (TanStack Query + `FlatList`) e abre o detalhe de cada filme
via Stack Navigator. Cada filme tem um botão ❤️ que favorita/desfavorita usando um store Zustand;
os favoritos são salvos no MMKV e sobrevivem a reloads. Ao tocar no coração, ele faz um "pop"
animado com Reanimated (escala 1 → 1.4 → 1 + leve rotação) rodando na UI thread.

## Arquitetura

```
src/
├── services/
│   └── api.ts                ← axios + interceptor do token TMDB
├── queries/movies/
│   ├── get-popular-movies.ts ← TanStack Query (staleTime 5 min)
│   ├── get-movie-by-id.ts
│   └── search-movies.ts
├── routes/
│   └── RootStack.tsx
├── screens/
│   ├── MovieList.tsx
│   └── MovieDetail.tsx
├── components/
│   ├── MovieCard.tsx
│   └── HeartButton.tsx       ← animação Reanimated
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts     ← Zustand + persist manual (subscribe) + MMKV
└── storage/
    └── mmkv.ts               ← MMKV nativo / localStorage na web / memória como fallback
```

## Decisões técnicas

- **Reanimated opção A:** é a interação que acontece a todo momento na lista. `withSequence(withTiming(1.4), withSpring(1))`
  na escala e um "wiggle" de rotação rodam como worklets na UI thread (`useSharedValue` + `useAnimatedStyle`),
  então a animação continua fluida mesmo com o JS thread ocupado com o `toggle` do store.
- **MMKV em vez de AsyncStorage:** é síncrono (JSI, sem bridge), então o store lê os favoritos já na criação
  (`ids: loadInitial()`), sem estado de "carregando" nem flicker, e grava a cada mudança sem custo perceptível.
- **Persist manual via `subscribe`** em vez do middleware `persist`: o save fica explícito e só acontece quando
  `ids` muda de fato.
- **Fallback de storage:** `mmkv.ts` usa `localStorage` na web e memória quando o módulo nativo não existe
  (Expo Go / Jest), então os testes rodam sem mock.
- **Seletor derivado:** cada card usa `s.isFavorite(movie.id)`, que retorna boolean — o card só re-renderiza
  quando o próprio estado de favorito muda.

## Referência

- Reanimated — https://docs.swmansion.com/react-native-reanimated/
- MMKV — https://github.com/mrousavy/react-native-mmkv
- Zustand — https://github.com/pmndrs/zustand

---

## 🎁 Bonus implementado (opcional)

- [ ] **Bottom Tabs com aba Favoritos filtrada — +2pt**
- [ ] Deep link `expo://detail/<id>` — +1pt
- [ ] 2 das 3 opções Reanimated (A/B/C) — +1pt
- [ ] TanStack Query `staleTime` + `prefetchQuery` — +1pt (só `staleTime`; sem `prefetchQuery`)
- [x] Hermes habilitado — padrão do Expo SDK 54 (`app.json` não define `jsEngine`, então usa Hermes)
- [x] CI GitHub Actions — 11 testes Jest verdes (mínimo 6)

```ts
// src/queries/movies/get-popular-movies.ts
export const usePopularMovies = (page = 1) =>
  useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
```
