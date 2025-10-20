export function TagCloud({ tags }: { tags: string[] }) {
  return (
    <div className='flex gap-2'>
      {tags.map((tag) => (
        <span
          key={tag}
          className='rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground'
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
