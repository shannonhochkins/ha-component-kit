import { typeSync } from '@hakit/core/sync';
import { config } from 'dotenv';
// First, load the base .env file
config({ path: '.env' });
// Then load the .env.development file which should have the token
config({ path: '.env.development' });


(async function () {
  await typeSync({
    url: process.env.VITE_HA_URL!,
    token: process.env.VITE_HA_TOKEN!,
  });
}())