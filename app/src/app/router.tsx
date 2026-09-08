import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage';
import { JourneyPage } from '../features/journey/JourneyPage';
import { FreeModePage } from '../features/free-mode/FreeModePage';
import { CollectionPage } from '../features/collection/CollectionPage';
import { AboutPage } from '../features/about/AboutPage';
import { ChallengePage } from '../features/challenge/ChallengePage';
import { QuemSouEuPage } from '../features/challenge/quem-sou-eu/QuemSouEuPage';
import { FuncaoNaturezaPage } from '../features/challenge/funcao-natureza/FuncaoNaturezaPage';
import { RedeDaVidaPage } from '../features/challenge/rede-da-vida/RedeDaVidaPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/jornada', element: <JourneyPage /> },
  { path: '/modo-livre', element: <FreeModePage /> },
  { path: '/colecao', element: <CollectionPage /> },
  { path: '/sobre', element: <AboutPage /> },
  { path: '/desafio/quem-sou-eu', element: <QuemSouEuPage /> },
  { path: '/desafio/funcao-na-natureza', element: <FuncaoNaturezaPage /> },
  { path: '/desafio/rede-da-vida', element: <RedeDaVidaPage /> },
  { path: '/desafio/:mecanica', element: <ChallengePage /> },
]);
