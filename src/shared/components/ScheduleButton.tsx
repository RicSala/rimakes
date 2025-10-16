import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

type ScheduleButtonProps = {
  className?: string;
  label: string;
};
export function ScheduleButton({ className, label }: ScheduleButtonProps) {
  return (
    <Button className={cn('w-full border-2 border-primary', className)}>
      {label}
    </Button>
  );
}
