import { notFound } from 'next/navigation';

import { Link } from '@/shared/internationalization/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { OPEN_SOURCE_PROJECT_CARDS } from '@/shared/config/const/openSourceProjects';

export default async function Home({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const openSourceProject = OPEN_SOURCE_PROJECT_CARDS.find(
    (item) => item.id === project
  );

  if (!openSourceProject) {
    notFound();
  }

  return (
    <article className='mx-auto flex max-w-[60ch] flex-col gap-12'>
      <header className='flex flex-col items-center gap-6'>
        <h1 className='text-3xl font-semibold relative'>
          {openSourceProject.title}
          <Badge
            variant='outline'
            className='text-center text-muted-foreground absolute top-0 right-0 text-base translate-x-full translate-y-[-50%] rounded-full'
          >
            {openSourceProject.role}
          </Badge>
        </h1>
        <p className='text-center text-muted-foreground'>
          {openSourceProject.description}
        </p>
        {openSourceProject.why ? (
          <p className='text-center text-muted-foreground'>
            {openSourceProject.why}
          </p>
        ) : null}
      </header>

      {openSourceProject.postPath ? (
        <Link
          href={{
            pathname: '/blog/[slug]',
            params: { slug: openSourceProject.postPath },
          }}
          className='mx-auto rounded-md bg-primary px-4 py-2 text-primary-foreground'
        >
          Read the technical breakdown
        </Link>
      ) : null}
    </article>
  );
}
