import fs from 'node:fs/promises';
import path from 'node:path';

const HOST = 'trackpilot.fit';
const KEY = '0b92968c89fbac5354aeeb08a14b97ec';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const DEFAULT_URLS = [`https://${HOST}/`];

async function submitIndexNow() {
  const keyFilePath = path.join(process.cwd(), 'public', `${KEY}.txt`);
  const keyFileContent = (await fs.readFile(keyFilePath, 'utf-8')).trim();
  if (keyFileContent !== KEY) {
    throw new Error(`Key mismatch in ${keyFilePath}`);
  }

  const cliUrls = process.argv.slice(2).filter((arg) => arg.startsWith('https://'));
  const urlList = cliUrls.length > 0 ? cliUrls : DEFAULT_URLS;

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (response.status === 200 || response.status === 202) {
    console.log(`[indexnow] Submitted ${urlList.length} URL(s) -> HTTP ${response.status}`);
    return;
  }

  const body = await response.text();
  throw new Error(`[indexnow] Unexpected HTTP ${response.status}: ${body}`);
}

submitIndexNow().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
