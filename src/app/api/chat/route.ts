import {
  getBlogPosts,
  getCurrentTime,
  getWeather,
  navigate,
  updatePrimaryColor,
} from '@/app/api/chat/tools';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai';
import { getEdgeConfig } from '@/shared/lib/edgeConfig';

const BACKUP_PROMPT =
  'You are a helpful assistant, with some available tools to use.';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  //TODO: This is called every time... we need a more efficient way to get the prompt
  const prompt = (await getEdgeConfig('chat-prompt'))?.toString();

  if (!prompt) console.error('chat-prompt is not set');

  const result = streamText({
    model: openai('gpt-4.1-mini'),
    system: prompt ?? BACKUP_PROMPT,
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
