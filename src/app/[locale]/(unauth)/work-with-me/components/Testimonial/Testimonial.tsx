import { SectionHeader } from '../SectionHeader';
import Image from 'next/image';

type TestimonialProps = {
  name: string;
  description: string;
  image: string;
};
export function Testimonial({ name, description, image }: TestimonialProps) {
  return (
    <>
      <SectionHeader title={name} description={description} />
      <div className='flex flex-col gap-4'>
        <Image src={image} alt={name} width={100} height={100} />
      </div>
    </>
  );
}
