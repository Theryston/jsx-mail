import { GradientSectionBorder } from './GradientSectionBorder';
import { Hero } from './Hero';
import { Features } from './Features';
// import { Letter } from "./Letter";

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
