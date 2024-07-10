import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { downloadTranslations, extractTranslations } from './extract-translations';
import { config } from 'dotenv';
config({
  path: path.join(__dirname, '.env'),
});

const CACHE_PATH = './.cache';

const intercept = async () => {

  // Create directory if it doesn't exist
  const dirPath = path.join(__dirname, CACHE_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    const [filename, contents] = await scrapeHomeAssistant();
    // Save the JavaScript file
    fs.writeFileSync(path.join(dirPath, filename), contents);
    console.log(`Saved: ${filename}`);
  } else {
    // already have the file, continue onto next steps
    console.log('retrieved js file from cache');
  }
  // list the file starting with app. in the .cache directory
  const [filename] = fs.readdirSync(dirPath).filter(file => file.startsWith('app.'));
  const translations = await extractTranslations(path.join(dirPath, filename));
  await downloadTranslations(translations);


  process.exit(0);
};

async function scrapeHomeAssistant(): Promise<[fileName: string, contents: string]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  return new Promise((resolve, reject) => {
    (async () => {
      // Intercept requests
      await page.setRequestInterception(true);
      page.on('request', async (request) => {
        const requestUrl = request.url();
        const parsedUrl = new URL(requestUrl);
        const fileName = path.basename(parsedUrl.pathname);

        // Check if the file name starts with 'app' and ends with '.js'
        if (fileName.startsWith('app') && fileName.endsWith('.js')) {
          console.info(`Intercepted: ${requestUrl}`);
          try {
            // Fetch the JavaScript file
            const response = await fetch(requestUrl);
            if (response.ok) {
              const text = await response.text();
              resolve([fileName, text]);
            } else {
              console.error(`Failed to fetch ${requestUrl}: ${response.statusText}`);
              reject();
            }
          } catch (error) {
            console.error(`Error fetching ${requestUrl}:`, error);
            reject();
          }
        }

        // Continue the request
        request.continue();
      });

      // Navigate to the page
      await page.goto('http://homeassistant.local:8123/lovelace/home');

      try {
        // Wait for some time to allow all requests to be intercepted
        await page.waitForNetworkIdle({
          idleTime: 5000,
          timeout: 5000,
        }); // Adjust the timeout as necessary
      } catch (e) {
        // ignore
      }

      await browser.close();
    })();
  })
}

intercept().catch(error => {
  console.error('Error:', error);
  process.exit(0);
});