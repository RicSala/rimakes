import { AiTools } from '@/app/api/chat/tools';
import { ToolDisplayConfig } from '@/shared/chat/components/ToolCallDisplay';
import {
  BookIcon,
  ClockIcon,
  GlobeIcon,
  PaletteIcon,
  SunIcon,
} from 'lucide-react';

export const toolDisplayConfig: ToolDisplayConfig<AiTools> = {
  updatePrimaryColor: {
    icon: <PaletteIcon className='w-4 h-4' />,
    description: {
      input: 'Updating primary color',
      output: 'Primary color updated',
    },
  },
  getCurrentTime: {
    icon: <ClockIcon className='w-4 h-4' />,
    description: {
      input: 'Getting current time',
      output: 'Current time',
    },
  },
  getWeather: {
    icon: <SunIcon className='w-4 h-4' />,
    description: {
      input: 'Getting weather',
      output: 'Weather',
    },
  },
  navigate: {
    icon: <GlobeIcon className='w-4 h-4' />,
    description: {
      input: 'Navigating to path',
      output: 'Path navigated',
    },
  },
  getBlogPosts: {
    icon: <BookIcon className='w-4 h-4' />,
    description: {
      input: 'Getting blog posts',
      output: 'Blog posts',
    },
  },
};
