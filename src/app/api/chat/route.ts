import {
  getBlogPosts,
  getCurrentTime,
  getWeather,
  navigate,
  updatePrimaryColor,
} from '@/app/api/chat/tools';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log(messages);

  const result = streamText({
    model: openai('gpt-4.1-mini'),
    system: 'You are a helpful assistant, with some available tools to use.',
    messages: convertToModelMessages(messages),
    tools: {
      updatePrimaryColor,
      getCurrentTime,
      getWeather,
      goToPath: navigate,
      getBlogPosts,
    },
    stopWhen: stepCountIs(5), // Replaces maxSteps - allows AI to continue after tool calls
  });

  return result.toUIMessageStreamResponse();
}
