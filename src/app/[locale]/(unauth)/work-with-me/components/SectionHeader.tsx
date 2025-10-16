import { cn } from '@/shared/lib/utils';

type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};
export function SectionHeader({
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 items-center', className)}>
      <h2 className='text-4xl font-bold'>{title}</h2>
      {description && (
        <p className='text-lg text-muted-foreground'>{description}</p>
      )}
    </div>
  );
}
