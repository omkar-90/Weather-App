const { env } = require("../config/env");

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_ONECALL_URLS = [
  "https://api.openweathermap.org/data/3.0/onecall",
  "https://api.openweathermap.org/data/2.5/onecall",
];

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
    const error = new Error(payload?.message || (response.status === 404 ? notFoundMessage : defaultMessage));
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

  const fallbackUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${env.openWeatherApiKey}`;
  return fetchJsonOrThrow(fallbackUrl, "Forecast not found.", "Forecast service is unavailable.");
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
};
