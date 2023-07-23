import type { HassEntities } from "home-assistant-js-websocket";
import 'jest-localstorage-mock';
import { entities } from './mockEntities';
const timeRegex = /\d{2}:\d{2}/g;
const dateRegex = /20(2[3-9]|[3-9][0-9])-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g;
const ENTITIES = JSON.parse(JSON.stringify(entities)  
  // purposely using 2022 here as the regex should work for 9 years ;)
  .replace(dateRegex, '2022-07-23T03:14:01.164Z')
  .replace(timeRegex, '01:01'));

localStorage.setItem('hassTokens', JSON.stringify({
  access_token: "FAKE",
  token_type:"Bearer",
  expires_in: Number.MAX_SAFE_INTEGER,
  hassUrl: "http://fake.com",
  clientId: "http://localhost:6006/",
  expires: Number.MAX_SAFE_INTEGER,
  refresh_token:"FAKE"
}));
// eslint-disable-next-line react-refresh/only-export-components
export const connection = {
  id: 'fake'
}
// eslint-disable-next-line react-refresh/only-export-components
export const mocked = {
  callService: jest.fn(),
  getAllEntities: jest.fn().mockImplementation(() => ENTITIES),
  async getAuth() {
    return {
      expired: false,
    }
  },
  async getConfig() {
    return {
      time_zone: 'Australia/Sydney'
    }
  },
  async createConnection() {
    return connection;
  },
  subscribeEntities: jest.fn().mockImplementation((_: null, subScribeFn: (entities: HassEntities) => void) => {
    subScribeFn(ENTITIES);
  })
}

jest.mock('home-assistant-js-websocket', () => mocked);

import { HassConnect } from '@core';

// eslint-disable-next-line react-refresh/only-export-components
export const onReady = jest.fn();
// Custom wrapper component for testing
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <HassConnect onReady={onReady} hassUrl="http://fake.com">
    {children}
  </HassConnect>
}