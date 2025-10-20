import Image from 'next/image';

export async function HeroSection() {
  return (
    <section className='mx-auto px-4 text-center space-y-8' id='hero'>
      <h1 className='text-4xl font-bold'>
        Hey there, I&apos;m{' '}
        <Image
          src={'/images/personal/me.jpeg'}
          className='inline rounded-full'
          width={50}
          height={50}
          alt='Ricardo profile pic'
        />{' '}
        Ricardo
        <span className='text-5xl wave inline-block ml-2'>👋🏻</span>
      </h1>
      <p className='text-lg'>
        I&apos;m an dev entrepreneur with experience in diverse fields such as
        AI, ecommerce, finance, and more. This is my humble website to share my
        journey and projects.
      </p>
    </section>
  );
}
