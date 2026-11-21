import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage';

// Só a Home carrega de forma síncrona (é a 1ª tela em quase todo acesso). As demais
// usam `lazy` do react-router: o JS de cada tela só é baixado quando o usuário navega
// até ela, em vez de tudo ir junto no bundle inicial. `hydrateFallbackElement` evita uma
// tela em branco se o usuário recarregar o navegador direto numa dessas rotas.
const hydrateFallbackElement = <div style={{ minHeight: '100vh', background: 'var(--color-bg-app)' }} />;

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/jornada',
    hydrateFallbackElement,
    lazy: async () => {
      const { JourneyPage } = await import('../features/journey/JourneyPage');
      return { Component: JourneyPage };
    },
  },
  {
    path: '/modo-livre',
    hydrateFallbackElement,
    lazy: async () => {
      const { FreeModePage } = await import('../features/free-mode/FreeModePage');
      return { Component: FreeModePage };
    },
  },
  {
    path: '/colecao',
    hydrateFallbackElement,
    lazy: async () => {
      const { CollectionPage } = await import('../features/collection/CollectionPage');
      return { Component: CollectionPage };
    },
  },
  {
    path: '/sobre',
    hydrateFallbackElement,
    lazy: async () => {
      const { AboutPage } = await import('../features/about/AboutPage');
      return { Component: AboutPage };
    },
  },
  {
    path: '/desafio/quem-sou-eu',
    hydrateFallbackElement,
    lazy: async () => {
      const { QuemSouEuPage } = await import('../features/challenge/quem-sou-eu/QuemSouEuPage');
      return { Component: QuemSouEuPage };
    },
  },
  {
    path: '/desafio/funcao-na-natureza',
    hydrateFallbackElement,
    lazy: async () => {
      const { FuncaoNaturezaPage } = await import('../features/challenge/funcao-natureza/FuncaoNaturezaPage');
      return { Component: FuncaoNaturezaPage };
    },
  },
  {
    path: '/desafio/rede-da-vida',
    hydrateFallbackElement,
    lazy: async () => {
      const { RedeDaVidaPage } = await import('../features/challenge/rede-da-vida/RedeDaVidaPage');
      return { Component: RedeDaVidaPage };
    },
  },
  {
    path: '/desafio/:mecanica',
    hydrateFallbackElement,
    lazy: async () => {
      const { ChallengePage } = await import('../features/challenge/ChallengePage');
      return { Component: ChallengePage };
    },
  },
]);
