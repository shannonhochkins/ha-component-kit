import type { HassEntities } from "home-assistant-js-websocket";
import 'jest-localstorage-mock';
import { entities } from './mockEntities';



localStorage.setItem('hassTokens', JSON.stringify({
  access_token: "FAKE",
  token_type:"Bearer",
  expires_in:1800,
  hassUrl: "http://fake.com",
  clientId: "http://localhost:6006/",
  expires:1689039687823,
  refresh_token:"FAKE"
}));
// eslint-disable-next-line react-refresh/only-export-components
export const connection = {
  id: 'fake'
}
// eslint-disable-next-line react-refresh/only-export-components
export const mocked = {
  callService: jest.fn(),
  getAllEntities: jest.fn().mockImplementation(() => entities),
  async getAuth() {
    return {
      expired: false,
    }
  },
  async createConnection() {
    return connection;
  },
  subscribeEntities: jest.fn().mockImplementation((_: null, subScribeFn: (entities: HassEntities) => void) => {
    subScribeFn(entities);
  })
}

jest.mock('home-assistant-js-websocket', () => mocked);

import { HassConnect } from 'packages/core/src/HassConnect';

// eslint-disable-next-line react-refresh/only-export-components
export const onReady = jest.fn();
// Custom wrapper component for testing
export const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <HassConnect onReady={onReady} hassUrl="http://fake.com">
    {children}
  </HassConnect>
);