/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { typeSync } = require('./dist/sync/node/index.cjs');
require('dotenv').config();
(async function runner() {
  if (!process.env.HA_URL || !process.env.HA_TOKEN) return;
  await typeSync({
    url: process.env.HA_URL,
    token: process.env.HA_TOKEN,
    outDir: './src/types',
    filename: 'supported-services.ts',
    custom: false,
    // filter out domains that may not be relevant to users
    domainBlacklist: ['localtuya', 'nodered', 'wakeOnLan', 'ring', 'mqtt', 'ffmpeg', 'tplink', 'samsungtvSmart', 'deconz', "fullyKiosk", "googleAssistantSdk"],
    serviceBlacklist: ['mobileAppS7Tablet', 'mobileAppNatashasIphone', 'mobileAppSmT220', 'mobileAppShannonsPhone', 'gamingLightColorChanger', 'randomLightColour', 'saySomething'],
  })
})();
