import { ScheduleButton } from '@/shared/components/ScheduleButton';

type BannerProps = {
  title: string;
  description: string;
  buttonLabel: string;
};
export function Banner({ title, description, buttonLabel }: BannerProps) {
  return (
    <div className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-14'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-4xl font-bold'>{title}</h2>
          <p className='text-lg text-muted'>{description}</p>
        </div>
        <div className='flex flex-col justify-center'>
          <ScheduleButton label={buttonLabel} />
        </div>
      </div>
    </div>
  );
}
