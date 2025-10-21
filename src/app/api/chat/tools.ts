import { blog } from '@/shared/cms/queries/blogQueries';
import { routing } from '@/shared/internationalization/i18n/config';
import { InferUITool, tool, UIMessage, UIMessagePart } from 'ai';
import { z } from 'zod';

export const updatePrimaryColor = tool({
  description:
    'Update the primary color of the website using oklch color space',
  inputSchema: z.object({
    color: z
      .string()
      .describe('The primary color of the website using oklch color space'),
  }),
  execute: async (input) => {
    console.log('input', input);
    return {
      success: true,
      message: 'Primary color updated successfully',
    };
  },
});

// Current time tool - can be executed on client
export const getCurrentTime = tool({
  description: 'Get the current date and time',
  inputSchema: z.object({
    timezone: z
      .string()
      .optional()
      .describe('Timezone (optional, defaults to local)'),
  }),
  execute: async ({ timezone }: { timezone?: string }) => {
    const now = new Date();
    if (timezone) {
      return now.toLocaleString('en-US', { timeZone: timezone });
    }
    return now.toLocaleString();
  },
});

export const getWeather = tool({
  description: 'Get the weather for a given location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }: { location: string }) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true`
    );

    const data = await response.json();

    return data;
  },
});

export const navigate = tool({
  description: `Navigate to a given url / path of the website.
  There are two types of paths: internal ( /[locale]/[path] ) or external ( https://[domain]/[path] )
  Only external valid urls are:
  Calendar booking url: "https://cal.com/ricardo-sala-mano7b/rimakes?overlayCalendar=true&layout=month_view".

  Only internal valid paths are:
  ${Object.keys(routing.pathnames).join(
    ', '
  )} or any valid blog url, wich are in the format /blog/[slug]
  
  IMPORTANT: For external urls, always confirm with the user if they want to navigate to the url.
  `,
  inputSchema: z.object({
    path: z.string().describe('The path to navigate to'),
  }),

  execute: async ({ path }: { path: string }) => {
    return {
      success: true,
      message: `Navigated to ${path} successfully`,
    };
  },
});

export const getBlogPosts = tool({
  description: 'Get the latest blog posts',
  inputSchema: z.object({
    count: z.number().optional().describe('The number of blog posts to get'),
    locale: z
      .string()
      .optional()
      .describe('The locale to get the blog posts for'),
  }),
  execute: async ({ count, locale }: { count?: number; locale?: string }) => {
    return await blog.getPosts(locale ?? 'en');
  },
});

export type AiTools = {
  updatePrimaryColor: InferUITool<typeof updatePrimaryColor>;
  getCurrentTime: InferUITool<typeof getCurrentTime>;
  getWeather: InferUITool<typeof getWeather>;
  navigate: InferUITool<typeof navigate>;
  getBlogPosts: InferUITool<typeof getBlogPosts>;
};

export type ChatMessageMetadata = {
  timestamp?: string;
  userId?: string;
  sessionId?: string;
  // Add any custom metadata you need
};

export type ChatUIMessage = UIMessage<
  ChatMessageMetadata,
  Record<string, unknown>,
  AiTools
>;
export type ChatUIMessagePart = UIMessagePart<Record<string, unknown>, AiTools>;
