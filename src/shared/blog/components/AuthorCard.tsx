import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared/components/ui/avatar';

export type BlogAuthor = {
  _title?: string;
  name?: string;
  avatar?: {
    url?: string;
  } | null;
};

type AuthorCardProps = {
  date: string;
  author?: BlogAuthor;
};
export function AuthorCard({ date, author }: AuthorCardProps) {
  const authorName = author?._title ?? author?.name ?? 'Ricardo Sala';

  return (
    <div className='flex items-center gap-3'>
      <Avatar className='h-full'>
        <AvatarImage src={author?.avatar?.url} alt='avatar' />
        <AvatarFallback className='text-[10px]'>
          {authorName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className='text-sm font-semibold'>{authorName}</p>
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
