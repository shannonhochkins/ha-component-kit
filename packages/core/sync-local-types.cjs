/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { typeSync } = require('./dist/sync/node/index.cjs');
require('dotenv').config();
(async function runner() {
  await typeSync({
    url: process.env.HA_URL,
    token: process.env.HA_TOKEN,
    outDir: './src/types',
    filename: 'supported-services.ts',
    custom: false,
    // filter out domains that may not be relevant to users
    domainBlacklist: ['localtuya', 'wakeOnLan', 'ffmpeg', 'tplink', 'samsungtvsmart', 'deconz']
  })
})();