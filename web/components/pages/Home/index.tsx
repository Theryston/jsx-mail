import { GradientSectionBorder } from './GradientSectionBorder';
import { Hero } from './Hero';
import { Features } from './Features';

export default function Home() {
  return (
    <>
      <main className="relative">
        <Hero />
        <GradientSectionBorder>
          <Features />
        </GradientSectionBorder>
      </main>
    </>
  );
}
