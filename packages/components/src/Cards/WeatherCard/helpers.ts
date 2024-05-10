export const convertWindSpeedToMS = (windSpeed: number, unit: string): number => {
  switch (unit) {
    case "ft/s":
      return windSpeed * 0.3048;
    case "km/h":
      return windSpeed / 3.6;
    case "kn":
      return windSpeed * 0.514444;
    case "m/s":
      return windSpeed;
    case "mph":
      return windSpeed * 0.44704;
    default:
      throw new Error("Unsupported wind speed unit");
  }
};

export const convertTemperatureToCelsius = (temperature: number, unit: string): number => {
  switch (unit) {
    case "°C":
      return temperature;
    case "°F":
      return (temperature - 32) * (5 / 9);
    default:
      throw new Error("Unsupported temperature unit");
  }
};

export const convertTemperatureFromCelsius = (temperature: number, unit: string): number => {
  switch (unit) {
    case "°C":
      return temperature;
    case "°F":
      return (temperature * 9) / 5 + 32;
    default:
      throw new Error("Unsupported target temperature unit");
  }
};

/**
 *
 * @param {number} temperature Temperature in celcius / fahrenheit
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @returns {number} Heat Index in celcius / farhenheit
 */
export function heatIndex(temperature: number, unit: string, humidity: number) {
  if (humidity > 100 || humidity < 0) return null;

  const T = convertTemperatureToCelsius(temperature, unit);
  const R = humidity;

  const c1 = -8.78469475556;
  const c2 = 1.61139411;
  const c3 = 2.33854883889;
  const c4 = -0.14611605;
  const c5 = -0.012308094;
  const c6 = -0.0164248277778;
  const c7 = 0.002211732;
  const c8 = 0.00072546;
  const c9 = -0.000003582;

  const Te2 = T ** 2;
  const Re2 = R ** 2;

  const HI = c1 + c2 * T + c3 * R + c4 * T * R + c5 * Te2 + c6 * Re2 + c7 * Te2 * R + c8 * T * Re2 + c9 * Te2 * Re2;

  return convertTemperatureFromCelsius(HI, unit);
}

/**
 *
 * @param {number} temperature Temperature in Celcius / Fahrenheit
 * @param {number} windSpeed Windspeed in M/S (meter per second)
 * @returns {number} Wind Chill Index in original unit
 */
export function windChillIndex(temperature: number, unit: string, windSpeed: number, windSpeedUnit: string) {
  const v = meterPerSecondToKilometerPerHour(convertWindSpeedToMS(windSpeed, windSpeedUnit));
  const Ta = convertTemperatureToCelsius(temperature, unit);
  const v_exp = v ** 0.16;
  const Twc = 13.12 + 0.6215 * Ta - 11.37 * v_exp + 0.3965 * Ta * v_exp;
  return convertTemperatureFromCelsius(Twc, unit);
}

/**
 * Convert M/S to KM/H
 * @param {number} mps Meter Per Second
 * @returns {number} KM/H
 */
export function meterPerSecondToKilometerPerHour(mps: number) {
  return mps * 3.6;
}

/**
 * @param {number} temperature Temperature in Celsius / Fahrenheit
 * @param {number} humidity Humidity in RH (Relative Humidity)
 * @param {number} windSpeed Windspeed in M/S (meter per second)
 * @returns {number} Apparent Temperature in original unit
 */
export function getAdditionalWeatherInformation(
  temperature?: number,
  unit?: string,
  windSpeedInMs?: number,
  windSpeedUnit?: string,
  humidity?: number,
): {
  feelsLike: number | null;
  heatIndex: number | null;
  windChill: number;
} | null {
  if (!temperature || !unit || !windSpeedInMs || !windSpeedUnit || !humidity) return null;
  const temperatureInCelsius = convertTemperatureToCelsius(temperature, unit);
  const heatIndexValue = heatIndex(temperature, unit, humidity);
  const windChillValue = windChillIndex(temperature, unit, windSpeedInMs, windSpeedUnit);
  // For hot weather, use Heat Index
  // For cold weather, use Wind Chill
  // For moderate weather, apparent temperature is close to the actual temperature
  const feelsLike = temperatureInCelsius >= 27 ? heatIndexValue : temperatureInCelsius <= 10 ? windChillValue : temperature;
  return {
    feelsLike,
    heatIndex: heatIndexValue,
    windChill: windChillValue,
  };
}
