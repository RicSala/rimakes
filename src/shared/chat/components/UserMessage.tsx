type UserMessageProps = {
  text: string;
};
export function UserMessage({ text }: UserMessageProps) {
  return (
    <div className={`flex p-2 mb-4 justify-end`}>
      <div
        className={`flex gap-1 p-2 px-4 rounded-3xl bg-primary rounded-br-none`}
      >
        <p className='font-regular [font-size:16px] leading-[1.7] text-primary-foreground'>
          {text}
        </p>
      </div>
    </div>
  );
}
