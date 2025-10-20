import { ScheduleButton } from '@/shared/components/ScheduleButton';

type BannerProps = {
  title: string;
  description: string;
  buttonLabel: string;
};
export function Banner({ title, description, buttonLabel }: BannerProps) {
  return (
    <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-14 @container'>
      <div className='flex-col flex @xl:flex-row justify-between gap-8'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl font-bold'>{title}</h2>
          <p className='text-lg text-muted'>{description}</p>
        </div>
        <div className='flex flex-col justify-center'>
          <ScheduleButton label={buttonLabel} />
        </div>
      </div>
      <p className='mt-6'>
        Or you can always drop me an email{' '}
        <a href='mailto:ricardo@rimakes.com?subject=Let%27s%20work%20together&body=Hi%20Ricardo%2C%0A%0AI%27d%20like%20to%20discuss...'>
          ricardo@rimakes.com
        </a>
      </p>
    </div>
  );
}
