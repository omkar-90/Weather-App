const { env } = require("../config/env");

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_ONECALL_URLS = [
  "https://api.openweathermap.org/data/3.0/onecall",
  "https://api.openweathermap.org/data/2.5/onecall",
];
const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

function ensureApiKey() {
  if (!env.openWeatherApiKey) {
    const error = new Error("OPENWEATHER_API_KEY is missing. Add it to your .env file.");
    error.statusCode = 500;
    throw error;
  }
}

async function fetchJsonOrThrow(url, notFoundMessage, defaultMessage) {
  const response = await fetch(url);
  const payload = await tryParseJson(response);

  if (!response.ok) {
    const message = response.status === 404
      ? notFoundMessage
      : payload?.message || defaultMessage;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return payload;
}

async function getCurrentWeather({ city, lat, lon }) {
  ensureApiKey();

  const params = city
    ? `q=${encodeURIComponent(city)}`
    : `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

  const url = `${OPENWEATHER_BASE_URL}/weather?${params}&units=metric&appid=${env.openWeatherApiKey}`;
  return fetchJsonOrThrow(url, "Location not found.", "Weather service is unavailable.");
}

async function getForecast(lat, lon) {
  ensureApiKey();

  for (const endpoint of OPENWEATHER_ONECALL_URLS) {
    try {
      const url = `${endpoint}?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&exclude=minutely,alerts&units=metric&appid=${env.openWeatherApiKey}`;
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn("One Call forecast fetch failed:", error.message);
    }
  }

  try {
    return await getOpenMeteoHourlyForecast(lat, lon);
  } catch (error) {
    console.warn("Open-Meteo hourly forecast fetch failed:", error.message);
  }

  const openWeatherFiveDayUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${env.openWeatherApiKey}`;
  return fetchJsonOrThrow(openWeatherFiveDayUrl, "Forecast not found.", "Forecast service is unavailable.");
}

async function getOpenMeteoHourlyForecast(lat, lon) {
  const hourlyFields = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "precipitation_probability",
    "weather_code",
    "surface_pressure",
    "visibility",
    "wind_speed_10m",
    "uv_index",
  ].join(",");
  const url = `${OPEN_METEO_FORECAST_URL}?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&hourly=${hourlyFields}&forecast_days=7&timezone=auto&timeformat=unixtime&wind_speed_unit=ms`;
  const payload = await fetchJsonOrThrow(url, "Forecast not found.", "Forecast service is unavailable.");

  return normalizeOpenMeteoForecast(payload);
}

function normalizeOpenMeteoForecast(payload) {
  const hourly = payload?.hourly;
  if (!hourly || !Array.isArray(hourly.time) || !hourly.time.length) {
    const error = new Error("Hourly forecast is unavailable.");
    error.statusCode = 502;
    throw error;
  }

  const hourlyEntries = hourly.time.map((timestamp, index) => {
    const weather = mapOpenMeteoWeatherCode(hourly.weather_code?.[index]);

    return {
      dt: Number(timestamp),
      temp: hourly.temperature_2m?.[index] ?? null,
      feels_like: hourly.apparent_temperature?.[index] ?? null,
      humidity: hourly.relative_humidity_2m?.[index] ?? null,
      pop: normalizeProbability(hourly.precipitation_probability?.[index]),
      weather: [weather],
      pressure: hourly.surface_pressure?.[index] ?? null,
      visibility: hourly.visibility?.[index] ?? null,
      wind_speed: hourly.wind_speed_10m?.[index] ?? 0,
      uvi: hourly.uv_index?.[index] ?? null,
    };
  }).filter((entry) => typeof entry.dt === "number" && typeof entry.temp === "number");

  return {
    source: "open-meteo",
    timezone_offset: payload.utc_offset_seconds || 0,
    hourly: hourlyEntries,
    daily: buildDailyForecastFromHourly(hourlyEntries, payload.utc_offset_seconds || 0),
  };
}

function buildDailyForecastFromHourly(hourlyEntries, timezoneOffset) {
  const groupedByDay = new Map();

  hourlyEntries.forEach((entry) => {
    const date = new Date((entry.dt + timezoneOffset) * 1000);
    const dayKey = [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");

    if (!groupedByDay.has(dayKey)) {
      groupedByDay.set(dayKey, []);
    }

    groupedByDay.get(dayKey).push(entry);
  });

  return Array.from(groupedByDay.values()).slice(0, 7).map((entries) => {
    const temps = entries.map((entry) => entry.temp);
    const representative = pickRepresentativeHourlyEntry(entries, timezoneOffset);

    return {
      dt: representative.dt,
      temp: {
        day: representative.temp,
        min: Math.min(...temps),
        max: Math.max(...temps),
      },
      feels_like: {
        day: representative.feels_like ?? representative.temp,
      },
      humidity: representative.humidity,
      pressure: representative.pressure,
      wind_speed: representative.wind_speed,
      uvi: representative.uvi,
      weather: representative.weather,
    };
  });
}

function pickRepresentativeHourlyEntry(entries, timezoneOffset) {
  return entries.reduce((best, current) => {
    const bestHour = new Date((best.dt + timezoneOffset) * 1000).getUTCHours();
    const currentHour = new Date((current.dt + timezoneOffset) * 1000).getUTCHours();
    return Math.abs(currentHour - 12) < Math.abs(bestHour - 12) ? current : best;
  });
}

function normalizeProbability(value) {
  if (typeof value !== "number") {
    return 0;
  }

  return Math.max(0, Math.min(1, value / 100));
}

function mapOpenMeteoWeatherCode(code) {
  const numericCode = Number(code);

  if ([0, 1].includes(numericCode)) {
    return { id: 800, main: "Clear", description: "clear sky" };
  }

  if ([2, 3].includes(numericCode)) {
    return { id: 802, main: "Clouds", description: "partly cloudy" };
  }

  if ([45, 48].includes(numericCode)) {
    return { id: 741, main: "Mist", description: "fog" };
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(numericCode)) {
    return { id: 500, main: "Rain", description: "rain" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(numericCode)) {
    return { id: 600, main: "Snow", description: "snow" };
  }

  if ([95, 96, 99].includes(numericCode)) {
    return { id: 200, main: "Thunderstorm", description: "thunderstorm" };
  }

  return { id: 801, main: "Clouds", description: "cloudy" };
}

async function getGeocodingSuggestions(query) {
  ensureApiKey();
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${env.openWeatherApiKey}`;
  return fetchJsonOrThrow(url, "Locations not found.", "Geocoding service is unavailable.");
}

async function tryParseJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getGeocodingSuggestions,
};
