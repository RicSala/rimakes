type SectionHeadingProps = {
  title: string;
  description?: string;
};

export const SectionHeading = ({ title, description }: SectionHeadingProps) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-4xl font-bold'>{title}</h2>
      {description && (
        <p className='text-lg text-muted-foreground'>{description}</p>
      )}
    </div>
  );
};
