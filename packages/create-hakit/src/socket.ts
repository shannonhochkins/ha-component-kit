import WebSocket from 'ws';

export async function validateConnection(wsUrl: string, accessToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);

      // Handle connection open
      ws.on('open', () => {
          // Authenticate with the server
          ws.send(JSON.stringify({ type: 'auth', access_token: accessToken }));
      });

      // Handle incoming messages
      ws.on('message', (data) => {
          const message = JSON.parse(data.toString());
          if (message.type === 'auth_ok') {
              // Request user information
              ws.send(JSON.stringify({ id: 1, type: 'auth/current_user' }));
          } else if (message.type === 'result' && message.id === 1) {
              // Extract user info from the response
              const userName = message.result.name || 'Unknown User';
              ws.close(); // Close the connection
              resolve(`${userName}, We've validated the connection to Home Assistant!`);
          } else if (message.type === 'auth_invalid') {
              ws.close();
              reject(`Authentication failed: ${message.message}`);
          }
      });

      // Handle errors
      ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          reject(error);
      });
  });
}