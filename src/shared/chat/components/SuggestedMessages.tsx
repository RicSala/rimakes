export const SuggestedMessages = ({
  setInput,
  handleSubmission,
}: {
  setInput: (input: string) => void;
  handleSubmission: () => void;
}) => (
  <div className='flex flex-col gap-2'>
    <p className='text-neutral-800 ![font-size:16px]'>
      Me puedes preguntar lo que quieras. Por ejemplo:
    </p>
    {suggestedMessages.map((message) => (
      <div
        key={message}
        className='flex p-2 px-4 bg-primary-50/20 rounded-3xl items-center border border-primary-50/50 hover:cursor-pointer text-neutral-800'
        onClick={() => {
          setInput(message);
          // setInput is async, so we need to let it run before submitting
          setTimeout(() => {
            handleSubmission();
          }, 0);
        }}
      >
        {message}
      </div>
    ))}
  </div>
);

const suggestedMessages = [
  '¿Qué es rimakes.com?',
  '¿Qué proyectos has realizado?',
  '¿Cómo puedo personalizar mi proyecto?',
  '¿Cómo puedo contactar contigo?',
];
