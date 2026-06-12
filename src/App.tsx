import { lazy } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { LazySection } from './components/common/LazySection';
import { MusicToggle } from './components/common/MusicToggle';

/*
 * Code splitting: cada sección es un chunk independiente que solo
 * se descarga cuando el usuario se aproxima a ella (LazySection).
 * El Hero es el único módulo eager: es lo primero que se ve.
 */
const CounterSection = lazy(() => import('./components/sections/CounterSection'));
const TimelineSection = lazy(() => import('./components/sections/TimelineSection'));
const GalleryInterlude = lazy(() => import('./components/sections/GalleryInterlude'));
const LetterSection = lazy(() => import('./components/sections/LetterSection'));
const LilyGardenSection = lazy(() => import('./components/sections/LilyGardenSection'));
const PhraseRainSection = lazy(() => import('./components/sections/PhraseRainSection'));
const MapSection = lazy(() => import('./components/sections/MapSection'));
const MemoriesSection = lazy(() => import('./components/sections/MemoriesSection'));
const FinaleSection = lazy(() => import('./components/sections/FinaleSection'));

export default function App() {
  return (
    <main>
      <HeroSection />

      <LazySection minHeight="50vh">
        <CounterSection />
      </LazySection>

      <LazySection minHeight="40vh">
        <GalleryInterlude
          quote="Los pequeños momentos lo son todo"
          photos={[
            { src: '/photos/img001.webp', alt: 'Momento juntos', shape: 'polaroid', caption: 'Tú y yo' },
            { src: '/photos/img003.webp', alt: 'Una tarde especial', shape: 'circle' },
          ]}
        />
      </LazySection>

      <LazySection minHeight="200vh">
        <TimelineSection />
      </LazySection>

      <LazySection minHeight="80vh">
        <LetterSection />
      </LazySection>

      <LazySection minHeight="40vh">
        <GalleryInterlude
          quote="Contigo, hasta lo cotidiano brilla"
          photos={[
            { src: '/photos/img016.webp', alt: 'Recuerdo especial', shape: 'heart' },
            { src: '/photos/img017.webp', alt: 'Un día inolvidable', shape: 'elegant', caption: 'Inolvidable' },
          ]}
        />
      </LazySection>

      <LazySection minHeight="70vh">
        <LilyGardenSection />
      </LazySection>

      <LazySection minHeight="110vh">
        <PhraseRainSection />
      </LazySection>

      <LazySection minHeight="80vh">
        <MapSection />
      </LazySection>

      <LazySection minHeight="90vh">
        <MemoriesSection />
      </LazySection>

      <LazySection minHeight="100vh">
        <FinaleSection />
      </LazySection>

      <MusicToggle />
    </main>
  );
}
