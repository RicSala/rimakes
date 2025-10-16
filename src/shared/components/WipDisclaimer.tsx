import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

type WipDisclaimerProps = {
  className?: string;
};
export function WipDisclaimer({ className }: WipDisclaimerProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant='outline'
          className={cn('rounded-full text-lg', className)}
        >
          🚧 WIP 🚧
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        className='bg-primary text-primary-foreground max-w-[30ch] text-center'
        collisionPadding={10}
      >
        <p>This website is a work in progress</p>
        <p>
          Just wanted to get something up and running to get the ball rolling
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
