import { basehub as basehubClient } from 'basehub';

export const basehub = basehubClient({
  token: process.env.BASEHUB_TOKEN,
});
