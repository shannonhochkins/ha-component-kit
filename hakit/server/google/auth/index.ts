import { existsSync } from 'fs';
import { GoogleAuth, GoogleAuthOptions } from 'google-auth-library';
import { join } from 'path';
import { APP_DIRECTORY } from '../../constants.js';

const SERVICE_ACCOUNT_FILE = join(APP_DIRECTORY, 'service-account.json');

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
];

/**
 * Load or request or authorization to call APIs.
 */
export async function authorize() {
  // check if the service account file exists
  // if not, throw an error
  if (existsSync(SERVICE_ACCOUNT_FILE) === false) {
    throw new Error('Service account file not found');
  }

  let googleAuthParams: GoogleAuthOptions = {
    keyFile: SERVICE_ACCOUNT_FILE,
  };

  return new GoogleAuth({
    ...googleAuthParams,
    scopes: SCOPES,
  });
}
