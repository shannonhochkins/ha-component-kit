type MockHistory = {
    s: string;
    lu: number;
  };

  function generateMockHistory(length: number): MockHistory[] {
    const data: MockHistory[] = [];
  
    const now = Date.now() / 1000; // Current time in seconds
    const startTime = now - 24 * 60 * 60; // Start time set to 24 hours ago
  
    for (let i = 0; i < length; i++) {
      const s = (Math.random() * (25 - 20) + 10).toFixed(1); // Random number between 25 and 20, converted to a string with one decimal
      const lu = startTime + i * 15 * 60; // Starting from 2 hours ago and increment by 15 minutes * index
  
      data.push({ s, lu });
    }
  
    return data;
  }

const mockHistoryData = generateMockHistory(100);

export default {
    "states": {
        "sensor.air_conditioner_inside_temperature": mockHistoryData
    },
    "start_time": mockHistoryData[0]?.lu ?? Date.now() / 1000,
    "end_time": mockHistoryData[mockHistoryData.length - 1]?.lu ?? Date.now() / 1000
}