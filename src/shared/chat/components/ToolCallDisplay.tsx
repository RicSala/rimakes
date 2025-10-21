import { CheckCircle, ToolCaseIcon } from 'lucide-react';
import { ToolUIPart, getToolName } from 'ai';

// Tool UI component to display tool calls nicely
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToolCallDisplay = <T extends Record<string, any>>({
  toolPart,
  toolDisplayConfig,
}: {
  toolPart: ToolUIPart<T>;
  toolDisplayConfig: ToolDisplayConfig<T>;
}) => {
  const toolName = getToolName(toolPart);

  const isCompleted = toolPart.state === 'output-available';
  const hasError = toolPart.state === 'output-error';
  const tool = toolDisplayConfig[toolName];

  const toolIcon = tool ? tool.icon : <ToolCaseIcon />;
  const toolDescription = tool
    ? tool.description
    : { input: 'No description', output: 'No description' };

  return (
    <div
      className={`border rounded-lg p-3 ${
        isCompleted
          ? 'bg-green-50 border-green-200'
          : hasError
          ? 'bg-red-50 border-red-200'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className='flex items-center gap-2 mb-2 text-primary'>
        {toolIcon}
        <span className='font-medium text-sm'>
          {isCompleted ? toolDescription.output : toolDescription.input}
        </span>
        {isCompleted && <CheckCircle className='w-4 h-4 text-green-600' />}
        {toolPart.state === 'input-streaming' && (
          <div className='animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full' />
        )}
      </div>

      {toolPart.input && (
        <div className='text-xs text-muted-foreground mb-2 max-h-20 overflow-y-auto overflow-x-hidden'>
          <strong>Input:</strong> {JSON.stringify(toolPart.input)}
        </div>
      )}

      {toolPart.state === 'output-available' && toolPart.output && (
        <div className='text-xs text-muted-foreground max-h-20 overflow-y-auto overflow-x-hidden'>
          <strong>Result:</strong>
          <div className='mt-1 p-2 bg-white rounded border'>
            {typeof toolPart.output === 'string'
              ? toolPart.output
              : JSON.stringify(toolPart.output, null, 2)}
          </div>
        </div>
      )}

      {hasError && toolPart.state === 'output-error' && (
        <div className='text-xs text-red-600'>
          <strong>Error:</strong>{' '}
          {toolPart.errorText || 'Tool execution failed'}
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ToolDisplayConfig<T extends Record<string, any>> = Record<
  keyof T,
  {
    icon: React.ReactNode;
    description: {
      input: string;
      output: string;
    };
  }
>;
