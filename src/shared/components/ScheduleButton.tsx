import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type ScheduleButtonProps = {
  className?: string;
  label: string;
};
export function ScheduleButton({ className, label }: ScheduleButtonProps) {
  return (
    <a
      href='https://cal.com/ricardo-sala-mano7b/rimakes?overlayCalendar=true&layout=month_view'
      className={cn(buttonVariants({ variant: 'secondary' }), className)}
      target='_blank'
      rel='noopener noreferrer'
    >
      {label}
    </a>
  );
}
