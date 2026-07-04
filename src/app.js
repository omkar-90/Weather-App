const express = require("express");
const path = require("path");
const { getCurrentWeather, getForecast, getGeocodingSuggestions } = require("./services/weather.service");

const app = express();
const rootDir = path.resolve(__dirname, "..");

app.use(express.json());
app.use(express.static(rootDir));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/weather", async (request, response) => {
  try {
    const { city, lat, lon } = request.query;

    if (!city && (!lat || !lon)) {
      response.status(400).json({ message: "Provide either a city or both lat and lon." });
      return;
    }

    const weather = await getCurrentWeather({ city, lat, lon });
    response.json(weather);
  } catch (error) {
    response.status(error.statusCode || 500).json({
      message: error.message || "Unable to fetch current weather.",
    });
  }
});

app.get("/api/forecast", async (request, response) => {
  try {
    const { lat, lon } = request.query;

    if (!lat || !lon) {
      response.status(400).json({ message: "lat and lon are required." });
      return;
    }

    const forecast = await getForecast(lat, lon);
    response.json(forecast);
  } catch (error) {
    response.status(error.statusCode || 500).json({
      message: error.message || "Unable to fetch forecast data.",
    });
  }
});

app.get("/api/geocode", async (request, response) => {
  try {
    const { q } = request.query;

    if (!q || q.trim().length < 2) {
      response.status(400).json({ message: "Provide a valid search query of at least 2 characters." });
      return;
    }

    const locations = await getGeocodingSuggestions(q);
    response.json(locations);
  } catch (error) {
    response.status(error.statusCode || 500).json({
      message: error.message || "Unable to fetch geocoding data.",
    });
  }
});

app.get("*", (_request, response) => {
  response.sendFile(path.join(rootDir, "index.html"));
});

module.exports = app;
