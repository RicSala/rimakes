import { SectionHeader } from '@/app/[locale]/(unauth)/work-with-me/components/SectionHeader';

type TechnologiesProps = {};
export function Technologies({}: TechnologiesProps) {
  return (
    <>
      <SectionHeader
        title='Technologies'
        description='We use the following technologies'
      />
      <p>
        We are at the cutting edge of AI technology, but our architecture is
        always the same. Why? Because that allows us to focus on the business
        logic and the user experience.
      </p>
      <h3>Tech stack</h3>
      <p>Nextjs Typescript TailwindCSS Shadcn UI Vercel</p>
      <h3>AI Technologies</h3>
      <p>OpenAI Anthropic Gemini Claude</p>
    </>
  );
}
