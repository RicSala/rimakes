// lib/edgeConfig.ts
import { get, has, getAll } from '@vercel/edge-config';

// Define your Edge Config schema
type EdgeConfigSchema = {
  'chat-prompt': string;
};

// Type-safe get function
export async function getEdgeConfig<K extends keyof EdgeConfigSchema>(
  key: K
): Promise<EdgeConfigSchema[K] | undefined> {
  return await get(key);
}

// Type-safe has function
export async function hasEdgeConfig<K extends keyof EdgeConfigSchema>(
  key: K
): Promise<boolean> {
  return await has(key);
}

// Type-safe getAll function
export async function getAllEdgeConfig<K extends keyof EdgeConfigSchema>(
  keys: K[]
): Promise<Partial<EdgeConfigSchema>> {
  return await getAll(keys);
}
