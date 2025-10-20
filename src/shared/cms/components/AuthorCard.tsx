import { Author } from '@/shared/cms/queries/blogQueries';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared/components/ui/avatar';

type AuthorCardProps = {
  date: string;
  author?: Author;
};
export function AuthorCard({ date, author }: AuthorCardProps) {
  return (
    <div className='flex items-center gap-3'>
      <Avatar className='h-full'>
        <AvatarImage src={author?.avatar?.url} alt='avatar' />
        <AvatarFallback className='text-[10px]'>
          {author?._title.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className='text-sm font-semibold'>{author?._title}</p>
        <p className='text-sm text-muted-foreground'>
          {new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
