export const updatePrimaryColorClientTool = (input: unknown) => {
  // @ts-expect-error - toolCall.input is of type unknown
  const oklch = input.color;
  // set --primary-foreground to oklch
  document.documentElement.style.setProperty('--primary-foreground', oklch);
};
