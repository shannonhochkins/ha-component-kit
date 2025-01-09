/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
const { typeSync } = require('./dist/sync/node/index.cjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
(async function runner() {
  if (!process.env.VITE_HA_URL || !process.env.VITE_HA_TOKEN) {
    console.log('Missing .env params VITE_HA_URL and/or VITE_HA_TOKEN, skipping type sync');
    return;
  }
  await typeSync({
    url: process.env.VITE_HA_URL,
    token: process.env.VITE_HA_TOKEN,
    outDir: './src/types',
    filename: 'supported-services.ts',
    custom: false,
    // filter out domains that may not be relevant to users
    domainBlacklist: ['localtuya', 'nodered', 'wakeOnLan', 'ring', 'mqtt', 'ffmpeg', 'tplink', 'samsungtvSmart', 'deconz', "fullyKiosk", "googleAssistantSdk"],
    serviceBlacklist: ['mobileAppGalaxyWatch6ClassicYjfx', 'mobileAppIphone', 'mobileAppS7Tablet', 'mobileAppNatashasIphone', 'mobileAppSmT220', 'mobileAppShannonsPhone', 'gamingLightColorChanger', 'randomLightColour', 'saySomething'],
  })
})();
