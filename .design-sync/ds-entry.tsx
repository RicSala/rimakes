// Scoped bundle entry for design-sync.
//
// The package shape would otherwise synth-entry from the whole `src/` tree
// (source-kit.mjs: `export * from` every .tsx under src/), which for a Next.js
// app pulls in next/font, 'server-only', client components, etc. and can't be
// bundled by esbuild. Passing this file via `--entry` re-exports ONLY the
// components in scope for this test, so esbuild bundles a tight graph
// (button.tsx + card.tsx + radix-slot/cva/clsx/tailwind-merge). Same "ship the
// real shipped code" guarantee — just a scoped entry.
//
// To scale to the full ui/ set, add the other primitives' re-exports here and
// extend componentSrcMap in config.json.
export { Button, buttonVariants } from '@/shared/components/ui/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/shared/components/ui/card';
