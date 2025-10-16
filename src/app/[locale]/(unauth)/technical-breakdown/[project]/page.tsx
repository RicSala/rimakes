import { openSourceProjects as openSourceProjectsQuery } from '@/shared/cms/queries';
import { Pump } from 'basehub/react-pump';
import { RichText } from 'basehub/react-rich-text';
import { Link } from '@/shared/internationalization/navigation';
import { Badge } from '@/shared/components/ui/badge';

export default async function Home({
  params,
}: {
  params: Promise<{ project: string; locale: string }>;
}) {
  const { project, locale } = await params;
  return (
    <div className='flex flex-col gap-24'>
      <Pump
        queries={[
          openSourceProjectsQuery.openSourceProjectQuery(project, locale),
        ]}
      >
        {async ([data]) => {
          'use server';
          return (
            <article className='mx-auto flex  max-w-[60ch] flex-col gap-12'>
              <header className='flex flex-col items-center gap-6'>
                <h1 className='text-3xl font-semibold relative'>
                  {data.portfolio.openSource.item?._title}
                  <Badge
                    variant='outline'
                    className='text-center text-muted-foreground absolute top-0 right-0 text-base translate-x-full translate-y-[-50%] rounded-full'
                  >
                    {data.portfolio.openSource.item?.role}
                  </Badge>
                </h1>
                <p className=' text-center text-muted-foreground'>
                  {data.portfolio.openSource.item?.description}
                </p>
                <p className=' text-center text-muted-foreground'>
                  {data.portfolio.openSource.item?.why}
                </p>
                {/* {data.portfolio.openSource.item?.categories && (
                  <div className='flex gap-2'>
                    {data.portfolio.openSource.item?.categories.map((tag) => (
                      <span
                        key={tag._title}
                        className='rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground'
                      >
                        {tag._title}
                      </span>
                    ))}
                  </div>
                )} */}
              </header>

              <div className='prose'>
                {!data.portfolio.openSource.item?.technicalBreakdown && (
                  <div className='text-muted-foreground bg-orange-100 p-4 rounded-md'>
                    <p className='!p-0 !m-0'>
                      🤦🏻‍♂️ This project doesn't have a technical breakdown yet.
                    </p>
                    <p className='!p-0 !m-0'>
                      But rest assured, I'm working on it and it will be ready
                      soon.
                    </p>
                  </div>
                )}
                <RichText
                  components={{
                    a: ({ children, ...props }) => {
                      return (
                        <Link
                          {...props}
                          // @ts-expect-error "idk"
                          href={props.href as string}
                          className='text-primary'
                        >
                          {children}
                        </Link>
                      );
                    },
                  }}
                >
                  {
                    data.portfolio.openSource.item?.technicalBreakdown?.json
                      .content
                  }
                </RichText>
              </div>
            </article>
          );
        }}
      </Pump>
    </div>
  );
}
