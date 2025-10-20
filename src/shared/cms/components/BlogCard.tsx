import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { Link } from '@/shared/internationalization/navigation';
import { AuthorCard } from '@/shared/cms/components/AuthorCard';
import { Author } from '@/shared/cms/queries/blogQueries';
import { TagCloud } from '@/shared/components/TagCloud';

type BlogCardProps = {
  title: string;
  abstract: string;
  date: string;
  image: string;
  url: string;
  topic?: string;
  author: Author;
  categories: string[];
};
export function BlogCard({
  title,
  abstract,
  date,
  image,
  url,
  topic = '',
  author,
  categories,
}: BlogCardProps) {
  return (
    <Link
      className='group space-y-6 transition-transform hover:-translate-y-1'
      scroll={true}
      // @ts-expect-error - TODO: fix this
      href={url}
      prefetch
    >
      <div className='space-y-6'>
        <div className='relative aspect-[384/240] overflow-clip rounded-3xl border'>
          <Image src={image} alt={title} fill className='object-cover' />
        </div>
        <div className='space-y-2'>
          <p className='font-semibold text-primary'>{topic}</p>
          <h2 className='flex justify-between text-xl font-semibold'>
            {title}
            <ArrowRight className='inline-block h-6 w-6 -rotate-45 transition-transform group-hover:rotate-0' />
          </h2>
          <p className='line-clamp-2 text-muted-foreground'>{abstract}</p>
        </div>
        <TagCloud tags={categories} />
      </div>
      <AuthorCard date={date} author={author} />
    </Link>
  );
}
