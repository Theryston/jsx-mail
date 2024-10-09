import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Whats from '@/components/Whats';
import Why from '@/components/Why';
import Pricing from '@/components/Pricing';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex flex-col">
      <Header />

      <div className="flex flex-col px-6">
        <Hero />
        <div className="flex items-center justify-center flex-col lg:flex-row gap-6 pb-[20vh]">
          <img
            src="/code.svg"
            alt="code image"
            className="w-full md:w-auto md:h-56"
          />
          <img
            src="/arrow-left.svg"
            alt="arrow"
            className="h-4 rotate-90 md:rotate-0"
          />
          <img
            src="/email.svg"
            alt="email"
            className="w-full md:w-auto md:h-36"
          />
        </div>
        <Whats />
        <Why />
        <Pricing />
        <Faq />
      </div>

      <Footer />
    </main>
  );
}
