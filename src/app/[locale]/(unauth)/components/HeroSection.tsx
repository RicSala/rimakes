import { getTranslations } from 'next-intl/server';

type HeroSectionProps = {};
export async function HeroSection(props: HeroSectionProps) {
  const t = await getTranslations('heroSection');

  return (
    <>
      <section className='mx-auto px-4 text-center space-y-6' id='hero'>
        <h1 className='text-4xl font-bold'>
          Hey there, I'm Ricardo{' '}
          <span className='text-5xl wave inline-block'>👋🏻</span>
        </h1>
        <p className='text-lg'>
          I'm an dev entrepreneur with experience in diverse fields such as AI,
          ecommerce, finance, and more. This is my humble website to share my
          journey and projects.
        </p>
      </section>
    </>
  );
}
