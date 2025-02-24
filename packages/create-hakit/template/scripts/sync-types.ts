import { typeSync } from '@hakit/core/sync';
import { config } from 'dotenv';
config();

(async function () {
  await typeSync({
    url: process.env.VITE_HA_URL!,
    token: process.env.VITE_HA_TOKEN!,
  });
}())