import { Badge } from '@/shared/components/ui/badge';
import { buttonVariants } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { BookOpen, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type OpenSourceCardProps = {
  title: string;
  description: string;
  githubLink?: string;
  docsLink?: string;
  imageUrl?: string;
  why?: string;
  role?: string;
  className?: string;
  slug?: string;
};

export const OpenSourceCard = ({
  title,
  description,
  githubLink,
  docsLink,
  imageUrl,
  why,
  role,
  className,
  slug,
}: OpenSourceCardProps) => {
  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full group',
        className
      )}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className='relative w-full h-48 overflow-hidden bg-muted'>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover object-top transition-transform duration-300 group-hover:scale-105'
          />
        </div>
      )}

      {/* Header with Title and Role Badge */}
      <CardHeader className='space-y-3'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-xl leading-tight'>{title}</CardTitle>
          {role && (
            <Badge variant='secondary' className='shrink-0 text-[10px]'>
              {role}
            </Badge>
          )}
        </div>
        <CardDescription className='text-sm leading-relaxed'>
          {description}
        </CardDescription>
      </CardHeader>

      {/* Why Section */}
      {why && (
        <CardContent className='space-y-2'>
          <h4 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Why I Created This
          </h4>
          <p className='text-sm text-muted-foreground leading-relaxed'>{why}</p>
        </CardContent>
      )}

      {/* Footer with Links */}
      <CardFooter className='mt-auto pt-4 flex-col gap-2'>
        <div className='flex flex-wrap gap-2 w-full'>
          {githubLink && (
            <Link
              href={githubLink}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'flex-1'
              )}
            >
              <Github className='size-3' />
              <span>GitHub</span>
            </Link>
          )}
          {docsLink && (
            <Link
              href={docsLink}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'flex-1'
              )}
            >
              <BookOpen className='size-3' />
              <span>Docs</span>
            </Link>
          )}
        </div>
        {slug && (
          <Link
            href={`/technical-breakdown/${slug}`}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
          >
            <BookOpen className='size-3' />
            <span>Technical breakdown</span>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
