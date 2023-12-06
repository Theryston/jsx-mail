import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from './FadeIn';
import { Gradient } from './Gradient';
import { HeroText, SectionSubtext } from './Headings';
import { CTAButton } from './CTAButton';

export function Hero() {
  return (
    <FadeIn
      className="w-auto min-h-[calc(100svh-var(--nextra-navbar-height))] pb-16 pt-[48px] md:pb-24 lg:pb-32 md:pt-16 lg:pt-20 flex justify-start gap-8 items-center flex-col relative z-0"
      noVertical
    >
      <Gradient
        className="top-[-500px] opacity-20"
        conic
        height={1000}
        width={1000}
      />
      <FadeIn className="z-50 flex items-center justify-center w-full">
        <div className="absolute min-w-[614px] min-h-[614px]">
          <Image
            alt="Circles"
            height={614}
            src="/images/hero-circles.svg"
            width={614}
          />
        </div>

        <div className="w-[120px] h-[120px] z-50">
          <Image alt="Logo" height={120} src="/logo.svg" width={120} />
        </div>
      </FadeIn>
      <FadeIn
        className="z-50 flex flex-col items-center justify-center gap-5 px-6 text-center lg:gap-6"
        delay={0.15}
      >
        <HeroText h1>JSX Mail: Simplifying email development</HeroText>

        <SectionSubtext hero>
          An innovative and efficient framework for creating email templates
          using JSX syntax in a modern way.
        </SectionSubtext>
      </FadeIn>

      <FadeIn
        className="z-50 flex flex-col items-center w-full max-w-md gap-5 px-6"
        delay={0.3}
      >
        <div className="flex flex-col w-full gap-3 md:!flex-row">
          <CTAButton>
            <Link className="block py-3" href="/docs">
              Get Started
            </Link>
          </CTAButton>
          <CTAButton outline>
            <a
              className="block py-3"
              href="https://github.com/Theryston/jsx-mail"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </CTAButton>
        </div>
      </FadeIn>
    </FadeIn>
  );
}
