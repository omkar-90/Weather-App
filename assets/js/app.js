const WEATHER_API_BASE = "/api";
const LAST_LOCATION_STORAGE_KEY = "weather-last-location";

const fallbackWeather = {
  name: "Bengaluru",
  sys: { country: "IN", sunset: Math.floor(Date.now() / 1000) + 3600 * 8 },
  timezone: 19800,
  visibility: 9000,
  coord: { lat: 12.9716, lon: 77.5946 },
  weather: [{ main: "Clouds", description: "broken clouds" }],
  main: {
    temp: 28,
    feels_like: 31,
    humidity: 68,
    pressure: 1009,
  },
  wind: { speed: 5.4 },
};

const fallbackForecast = [
  { day: "Today", condition: "clouds", min: 24, max: 30 },
  { day: "Wed", condition: "rain", min: 23, max: 29 },
  { day: "Thu", condition: "clear", min: 22, max: 31 },
  { day: "Fri", condition: "clouds", min: 24, max: 30 },
  { day: "Sat", condition: "storm", min: 23, max: 28 },
  { day: "Sun", condition: "clear", min: 24, max: 32 },
  { day: "Mon", condition: "clouds", min: 25, max: 31 },
];

const fallbackHourlyForecast = [
  { label: "Now", shortLabel: "Now", temp: 28, precip: 10, condition: "clouds" },
  { label: "2 PM", shortLabel: "2 PM", temp: 29, precip: 8, condition: "clouds" },
  { label: "3 PM", shortLabel: "3 PM", temp: 30, precip: 6, condition: "clear" },
  { label: "4 PM", shortLabel: "4 PM", temp: 30, precip: 4, condition: "clear" },
  { label: "5 PM", shortLabel: "5 PM", temp: 29, precip: 12, condition: "clouds" },
  { label: "6 PM", shortLabel: "6 PM", temp: 27, precip: 18, condition: "rain" },
  { label: "7 PM", shortLabel: "7 PM", temp: 26, precip: 24, condition: "rain" },
  { label: "8 PM", shortLabel: "8 PM", temp: 25, precip: 20, condition: "rain" },
  { label: "9 PM", shortLabel: "9 PM", temp: 24, precip: 14, condition: "clouds" },
  { label: "10 PM", shortLabel: "10 PM", temp: 23, precip: 8, condition: "night" },
  { label: "11 PM", shortLabel: "11 PM", temp: 23, precip: 7, condition: "night" },
  { label: "12 AM", shortLabel: "12 AM", temp: 22, precip: 6, condition: "night" },
  { label: "1 AM", shortLabel: "1 AM", temp: 22, precip: 6, condition: "night" },
  { label: "2 AM", shortLabel: "2 AM", temp: 21, precip: 5, condition: "night" },
  { label: "3 AM", shortLabel: "3 AM", temp: 21, precip: 5, condition: "night" },
  { label: "4 AM", shortLabel: "4 AM", temp: 20, precip: 6, condition: "mist" },
  { label: "5 AM", shortLabel: "5 AM", temp: 20, precip: 8, condition: "mist" },
  { label: "6 AM", shortLabel: "6 AM", temp: 21, precip: 10, condition: "clouds" },
  { label: "7 AM", shortLabel: "7 AM", temp: 22, precip: 12, condition: "clouds" },
  { label: "8 AM", shortLabel: "8 AM", temp: 24, precip: 10, condition: "clouds" },
  { label: "9 AM", shortLabel: "9 AM", temp: 25, precip: 8, condition: "clear" },
  { label: "10 AM", shortLabel: "10 AM", temp: 26, precip: 6, condition: "clear" },
  { label: "11 AM", shortLabel: "11 AM", temp: 27, precip: 5, condition: "clear" },
  { label: "12 PM", shortLabel: "12 PM", temp: 28, precip: 4, condition: "clear" },
];

const weatherThemes = {
  clear: {
    bodyClass: "weather-clear",
    status: "Bright skies",
  },
  "few-clouds": {
    bodyClass: "weather-few-clouds",
    status: "Light cloud drift",
  },
  "scattered-clouds": {
    bodyClass: "weather-scattered-clouds",
    status: "Scattered cloud cover",
  },
  "broken-clouds": {
    bodyClass: "weather-broken-clouds",
    status: "Dense cloud layers",
  },
  overcast: {
    bodyClass: "weather-overcast",
    status: "Overcast skies",
  },
  clouds: {
    bodyClass: "weather-clouds",
    status: "Soft cloud cover",
  },
  rain: {
    bodyClass: "weather-rain",
    status: "Rain incoming",
  },
  snow: {
    bodyClass: "weather-snow",
    status: "Snowfall watch",
  },
  storm: {
    bodyClass: "weather-storm",
    status: "Storm conditions",
  },
  mist: {
    bodyClass: "weather-mist",
    status: "Low visibility",
  },
  night: {
    bodyClass: "weather-night",
    status: "Night forecast",
  },
};

const conditionIconMap = {
  clear: `
    <svg viewBox="0 0 120 120" class="icon-svg icon-sun" role="img" aria-label="Clear sky">
      <circle cx="60" cy="60" r="20"></circle>
      <g class="sun-rays">
        <line x1="60" y1="10" x2="60" y2="28"></line>
        <line x1="60" y1="92" x2="60" y2="110"></line>
        <line x1="10" y1="60" x2="28" y2="60"></line>
        <line x1="92" y1="60" x2="110" y2="60"></line>
        <line x1="25" y1="25" x2="37" y2="37"></line>
        <line x1="83" y1="83" x2="95" y2="95"></line>
        <line x1="83" y1="37" x2="95" y2="25"></line>
        <line x1="25" y1="95" x2="37" y2="83"></line>
      </g>
    </svg>
  `,
  "few-clouds": `
    <svg viewBox="0 0 160 120" class="icon-svg icon-few-clouds" role="img" aria-label="Few clouds">
      <circle cx="52" cy="42" r="18" class="sun-core"></circle>
      <g class="sun-rays">
        <line x1="52" y1="12" x2="52" y2="22"></line>
        <line x1="52" y1="62" x2="52" y2="72"></line>
        <line x1="24" y1="42" x2="34" y2="42"></line>
        <line x1="70" y1="42" x2="80" y2="42"></line>
      </g>
      <path d="M55 92h52a19 19 0 0 0 2-38 26 26 0 0 0-48-6A21 21 0 0 0 55 92Z"></path>
    </svg>
  `,
  "scattered-clouds": `
    <svg viewBox="0 0 170 120" class="icon-svg icon-scattered-clouds" role="img" aria-label="Scattered clouds">
      <g>
        <path d="M42 90h52a20 20 0 0 0 2-40 28 28 0 0 0-52-6A22 22 0 0 0 42 90Z"></path>
        <path class="cloud-back" d="M82 78h48a18 18 0 0 0 2-36 25 25 0 0 0-46-6A20 20 0 0 0 82 78Z"></path>
      </g>
    </svg>
  `,
  "broken-clouds": `
    <svg viewBox="0 0 180 128" class="icon-svg icon-broken-clouds" role="img" aria-label="Broken clouds">
      <g>
        <path d="M36 94h78a26 26 0 0 0 4-52 36 36 0 0 0-68-8A30 30 0 0 0 36 94Z"></path>
        <path class="cloud-back" d="M82 84h56a20 20 0 0 0 3-40 28 28 0 0 0-52-6A22 22 0 0 0 82 84Z"></path>
      </g>
    </svg>
  `,
  overcast: `
    <svg viewBox="0 0 190 132" class="icon-svg icon-overcast" role="img" aria-label="Overcast clouds">
      <g>
        <path d="M30 96h92a28 28 0 0 0 4-56 38 38 0 0 0-72-8A32 32 0 0 0 30 96Z"></path>
        <path class="cloud-back" d="M86 88h64a22 22 0 0 0 3-44 30 30 0 0 0-56-6A24 24 0 0 0 86 88Z"></path>
      </g>
    </svg>
  `,
  clouds: `
    <svg viewBox="0 0 160 120" class="icon-svg icon-clouds" role="img" aria-label="Cloudy">
      <g>
        <path d="M47 88h58a24 24 0 0 0 3-48 34 34 0 0 0-64-8A28 28 0 0 0 47 88Z"></path>
        <path class="cloud-back" d="M75 80h46a18 18 0 0 0 2-36 24 24 0 0 0-45-6A20 20 0 0 0 75 80Z"></path>
      </g>
    </svg>
  `,
  rain: `
    <svg viewBox="0 0 160 140" class="icon-svg icon-rain" role="img" aria-label="Rain">
      <path d="M45 76h64a24 24 0 0 0 4-48 32 32 0 0 0-60-7A26 26 0 0 0 45 76Z"></path>
      <g class="rain-strokes">
        <line x1="60" y1="88" x2="52" y2="116"></line>
        <line x1="84" y1="88" x2="76" y2="116"></line>
        <line x1="108" y1="88" x2="100" y2="116"></line>
      </g>
    </svg>
  `,
  snow: `
    <svg viewBox="0 0 160 140" class="icon-svg icon-snow" role="img" aria-label="Snow">
      <path d="M45 76h64a24 24 0 0 0 4-48 32 32 0 0 0-60-7A26 26 0 0 0 45 76Z"></path>
      <g class="snow-flakes">
        <circle cx="60" cy="102" r="5"></circle>
        <circle cx="84" cy="112" r="5"></circle>
        <circle cx="108" cy="100" r="5"></circle>
      </g>
    </svg>
  `,
  storm: `
    <svg viewBox="0 0 160 140" class="icon-svg icon-storm" role="img" aria-label="Storm">
      <path d="M45 76h64a24 24 0 0 0 4-48 32 32 0 0 0-60-7A26 26 0 0 0 45 76Z"></path>
      <path class="bolt" d="M86 84H68l12 2-8 26 28-32H82l4-16Z"></path>
    </svg>
  `,
  mist: `
    <svg viewBox="0 0 160 120" class="icon-svg icon-mist" role="img" aria-label="Mist">
      <path d="M42 68h60a22 22 0 0 0 0-44 28 28 0 0 0-54-7A24 24 0 0 0 42 68Z"></path>
      <g class="mist-lines">
        <line x1="30" y1="84" x2="126" y2="84"></line>
        <line x1="42" y1="98" x2="136" y2="98"></line>
      </g>
    </svg>
  `,
  night: `
    <svg viewBox="0 0 120 120" class="icon-svg icon-night" role="img" aria-label="Night">
      <path d="M72 16a38 38 0 1 0 24 68 40 40 0 1 1-24-68Z"></path>
      <circle cx="80" cy="32" r="4"></circle>
      <circle cx="95" cy="48" r="3"></circle>
    </svg>
  `,
};

function createWeatherCardArt(palette) {
  const motifs = {
    sun: `
      <circle cx="480" cy="92" r="44" fill="${palette.glow}" fill-opacity="0.9"/>
      <circle cx="480" cy="92" r="62" fill="${palette.glow}" fill-opacity="0.28"/>
    `,
    clouds: `
      <g fill="${palette.accent}" fill-opacity="0.78">
        <circle cx="445" cy="106" r="26"/>
        <circle cx="474" cy="94" r="32"/>
        <circle cx="510" cy="108" r="24"/>
        <rect x="430" y="108" width="98" height="22" rx="11"/>
      </g>
    `,
    rain: `
      <g fill="${palette.accent}" fill-opacity="0.82">
        <circle cx="450" cy="96" r="24"/>
        <circle cx="478" cy="88" r="30"/>
        <circle cx="512" cy="101" r="22"/>
        <rect x="436" y="101" width="94" height="22" rx="11"/>
      </g>
      <g stroke="${palette.accent}" stroke-opacity="0.75" stroke-width="4" stroke-linecap="round">
        <line x1="448" y1="134" x2="438" y2="162"/>
        <line x1="476" y1="134" x2="466" y2="162"/>
        <line x1="504" y1="134" x2="494" y2="162"/>
      </g>
    `,
    snow: `
      <g fill="${palette.accent}" fill-opacity="0.8">
        <circle cx="448" cy="100" r="24"/>
        <circle cx="478" cy="90" r="30"/>
        <circle cx="512" cy="102" r="22"/>
        <rect x="434" y="103" width="96" height="22" rx="11"/>
      </g>
      <g fill="#ffffff" fill-opacity="0.88">
        <circle cx="446" cy="150" r="5"/>
        <circle cx="476" cy="162" r="5"/>
        <circle cx="506" cy="148" r="5"/>
      </g>
    `,
    storm: `
      <g fill="${palette.glow}" fill-opacity="0.18">
        <circle cx="476" cy="94" r="72"/>
      </g>
      <g fill="${palette.accent}" fill-opacity="0.22">
        <circle cx="450" cy="98" r="24"/>
        <circle cx="478" cy="88" r="30"/>
        <circle cx="512" cy="101" r="22"/>
        <rect x="436" y="102" width="94" height="22" rx="11"/>
      </g>
      <path d="M482 122h-24l14 6-10 34 34-40h-20l6-20Z" fill="${palette.accent}"/>
    `,
    mist: `
      <g stroke="${palette.accent}" stroke-opacity="0.48" stroke-width="8" stroke-linecap="round">
        <line x1="394" y1="94" x2="532" y2="94"/>
        <line x1="422" y1="122" x2="546" y2="122"/>
        <line x1="404" y1="150" x2="520" y2="150"/>
      </g>
    `,
    night: `
      <path d="M486 54a42 42 0 1 0 28 72 45 45 0 1 1-28-72Z" fill="${palette.accent}" fill-opacity="0.92"/>
      <circle cx="438" cy="72" r="4" fill="${palette.accent}" />
      <circle cx="532" cy="86" r="3" fill="${palette.accent}" />
      <circle cx="500" cy="54" r="2.5" fill="${palette.accent}" />
    `,
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 280" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${palette.top}"/>
          <stop offset="100%" stop-color="${palette.bottom}"/>
        </linearGradient>
        <radialGradient id="wash" cx="78%" cy="28%" r="50%">
          <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="560" height="280" fill="url(#sky)"/>
      <rect width="560" height="280" fill="url(#wash)"/>
      ${motifs[palette.motif]}
      <path d="M0 210C88 178 162 190 246 174C336 158 414 124 560 158V280H0Z" fill="${palette.horizon}" fill-opacity="0.34"/>
      <path d="M0 230C80 210 164 220 258 198C354 176 434 170 560 190V280H0Z" fill="${palette.accent}" fill-opacity="0.16"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const cardArtMap = {
  clear: createWeatherCardArt({
    top: "#ffcf6e",
    bottom: "#ff8e53",
    glow: "#ffe6a3",
    accent: "#fff5cf",
    horizon: "#ffd7b0",
    motif: "sun",
  }),
  "few-clouds": createWeatherCardArt({
    top: "#8ec0ff",
    bottom: "#4978b9",
    glow: "#ffe6a3",
    accent: "#f6fbff",
    horizon: "#afc8e7",
    motif: "sun",
  }),
  "scattered-clouds": createWeatherCardArt({
    top: "#7ea3d1",
    bottom: "#3c5f8b",
    glow: "#d7e7ff",
    accent: "#eef5ff",
    horizon: "#89a4c3",
    motif: "clouds",
  }),
  "broken-clouds": createWeatherCardArt({
    top: "#677d9b",
    bottom: "#2d405d",
    glow: "#c7d5e8",
    accent: "#e8eef7",
    horizon: "#6f8197",
    motif: "clouds",
  }),
  overcast: createWeatherCardArt({
    top: "#5b6b81",
    bottom: "#243345",
    glow: "#bcc8d8",
    accent: "#dde4ec",
    horizon: "#5f7084",
    motif: "clouds",
  }),
  clouds: createWeatherCardArt({
    top: "#90a9c7",
    bottom: "#4b6584",
    glow: "#c8d8f0",
    accent: "#edf4ff",
    horizon: "#8798b2",
    motif: "clouds",
  }),
  rain: createWeatherCardArt({
    top: "#335c81",
    bottom: "#1b2f45",
    glow: "#8db6e2",
    accent: "#dcecff",
    horizon: "#4a7297",
    motif: "rain",
  }),
  snow: createWeatherCardArt({
    top: "#d9efff",
    bottom: "#8bb6d9",
    glow: "#ffffff",
    accent: "#ffffff",
    horizon: "#c0daf0",
    motif: "snow",
  }),
  storm: createWeatherCardArt({
    top: "#28334e",
    bottom: "#090f1f",
    glow: "#8da1d9",
    accent: "#ffd86f",
    horizon: "#36415f",
    motif: "storm",
  }),
  mist: createWeatherCardArt({
    top: "#9da8b3",
    bottom: "#65717d",
    glow: "#dbe2ea",
    accent: "#f6f8fb",
    horizon: "#95a0aa",
    motif: "mist",
  }),
  night: createWeatherCardArt({
    top: "#15203d",
    bottom: "#060b18",
    glow: "#9db5ff",
    accent: "#f5f8ff",
    horizon: "#23355f",
    motif: "night",
  }),
};

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");
  const locationBtn = document.getElementById("location-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const errorMessage = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");
  const forecastCards = document.getElementById("forecast-cards");
  const hourlyChart = document.getElementById("hourly-chart");
  const hourlyCards = document.getElementById("hourly-cards");
  const hourlyRailShell = hourlyCards.parentElement;

  const temperatureEl = document.getElementById("temperature");
  const conditionEl = document.getElementById("condition");
  const cityNameEl = document.getElementById("city-name");
  const dateTimeEl = document.getElementById("date-time");
  const weatherIconEl = document.getElementById("weather-icon");
  const weatherIconWrap = document.getElementById("weather-icon-wrap");
  const heroCopyEl = document.getElementById("hero-copy");
  const feelsLikeEl = document.getElementById("feels-like");
  const humidityEl = document.getElementById("humidity");
  const windSpeedEl = document.getElementById("wind-speed");
  const pressureEl = document.getElementById("pressure");
  const visibilityEl = document.getElementById("visibility");
  const uvIndexEl = document.getElementById("uv-index");
  const statusChip = document.getElementById("status-chip");

  let currentClockInterval = null;
  let lastWeatherSnapshot = fallbackWeather;
  let currentWeatherSnapshot = null;
  let activeForecastDays = [];
  let activeHourlyForecast = [];
  let currentLocationLabel = `${fallbackWeather.name}, ${fallbackWeather.sys.country}`;
  let currentHeroBaseline = null;
  let isSyncingHourlyScroll = false;

  initializeTheme();
  bindEvents();
  initializeHourlyScrollSync();
  hydrateWithFallback();
  initializeWeatherApp();

  function bindEvents() {
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const city = cityInput.value.trim();

      if (!city) {
        showError("Enter a city name to search for weather.");
        return;
      }

      await loadWeather({ city });
    });

    locationBtn.addEventListener("click", async () => {
      await loadWeatherForCurrentLocation(true);
    });

    themeToggle.addEventListener("change", () => {
      const isLight = themeToggle.checked;
      document.body.classList.toggle("theme-light", isLight);
      document.body.classList.toggle("theme-dark", !isLight);
      localStorage.setItem("weather-theme", isLight ? "light" : "dark");
    });
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem("weather-theme") || "dark";
    const isLight = savedTheme === "light";
    themeToggle.checked = isLight;
    document.body.classList.toggle("theme-light", isLight);
    document.body.classList.toggle("theme-dark", !isLight);
  }

  function initializeHourlyScrollSync() {
    if (!hourlyChart || !hourlyRailShell) {
      return;
    }

    hourlyChart.addEventListener("scroll", () => {
      syncHourlyScroll(hourlyChart, hourlyRailShell);
    });

    hourlyRailShell.addEventListener("scroll", () => {
      syncHourlyScroll(hourlyRailShell, hourlyChart);
    });
  }

  function syncHourlyScroll(source, target) {
    if (isSyncingHourlyScroll) {
      return;
    }

    const sourceScrollableWidth = source.scrollWidth - source.clientWidth;
    const targetScrollableWidth = target.scrollWidth - target.clientWidth;

    if (sourceScrollableWidth <= 0 || targetScrollableWidth <= 0) {
      return;
    }

    const progress = source.scrollLeft / sourceScrollableWidth;

    isSyncingHourlyScroll = true;
    target.scrollLeft = progress * targetScrollableWidth;
    requestAnimationFrame(() => {
      isSyncingHourlyScroll = false;
    });
  }

  function hydrateWithFallback() {
    renderWeather(fallbackWeather, fallbackForecast, true);
  }

  async function initializeWeatherApp() {
    const savedLocation = getSavedLocation();

    if (savedLocation) {
      cityInput.value = savedLocation.label || "";
      await loadWeather(savedLocation.query, { saveLocation: false });
      return;
    }

    await loadWeatherForCurrentLocation();
  }

  async function loadWeatherForCurrentLocation(showErrors = false) {
    try {
      const position = await getCurrentPosition();
      await loadWeather({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }, {
        saveLocation: true,
        locationLabel: "Current location",
      });
    } catch (error) {
      if (showErrors) {
        showError(error.message);
      }
    }
  }

  async function loadWeather({ city, lat, lon }, options = {}) {
    const { saveLocation = true, locationLabel = "" } = options;

    try {
      let weatherData;
      let forecastData;
      let warningMessage = "";

      weatherData = await fetchWeather({ city, lat, lon });
      try {
        forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);
      } catch (error) {
        forecastData = fallbackForecast;
        warningMessage = "Live 7-day forecast is unavailable. Showing preview forecast.";
      }

      if (saveLocation) {
        saveLastLocation(weatherData, { city, lat, lon, label: locationLabel });
      }

      if (city) {
        cityInput.value = weatherData.name;
      }

      renderWeather(weatherData, forecastData);
      if (warningMessage) {
        showError(warningMessage);
      } else {
        hideError();
      }
    } catch (error) {
      const fallbackWeatherData = city ? buildDemoWeather(city) : lastWeatherSnapshot;
      const message = error.message === "Location not found."
        ? error.message
        : "Live weather is unavailable. Showing preview data.";

      showError(message);
      renderWeather(fallbackWeatherData, fallbackForecast, true);
    }
  }

  function getSavedLocation() {
    const rawLocation = localStorage.getItem(LAST_LOCATION_STORAGE_KEY);

    if (!rawLocation) {
      return null;
    }

    try {
      const parsedLocation = JSON.parse(rawLocation);
      if (!parsedLocation || !parsedLocation.query) {
        return null;
      }
      return parsedLocation;
    } catch (error) {
      localStorage.removeItem(LAST_LOCATION_STORAGE_KEY);
      return null;
    }
  }

  function saveLastLocation(weatherData, source) {
    const hasCoordinates = typeof weatherData?.coord?.lat === "number" && typeof weatherData?.coord?.lon === "number";
    const resolvedQuery = source.city
      ? { city: weatherData.name }
      : hasCoordinates
        ? { lat: weatherData.coord.lat, lon: weatherData.coord.lon }
        : null;

    if (!resolvedQuery) {
      return;
    }

    const payload = {
      label: source.label || weatherData.name,
      query: resolvedQuery,
    };

    localStorage.setItem(LAST_LOCATION_STORAGE_KEY, JSON.stringify(payload));
  }

  async function fetchWeather({ city, lat, lon }) {
    const query = city
      ? `city=${encodeURIComponent(city)}`
      : `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

    let response;

    try {
      response = await fetch(`${WEATHER_API_BASE}/weather?${query}`);
    } catch (error) {
      throw new Error(getWeatherServiceErrorMessage());
    }

    if (!response.ok) {
      const errorPayload = await safeParseJson(response);
      throw new Error(
        errorPayload?.message
        || (response.status === 404 ? "Location not found." : getWeatherServiceErrorMessage())
      );
    }

    return response.json();
  }

  async function fetchForecast(lat, lon) {
    let response;

    try {
      response = await fetch(
        `${WEATHER_API_BASE}/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      );
    } catch (error) {
      throw new Error(getWeatherServiceErrorMessage());
    }

    if (!response.ok) {
      const errorPayload = await safeParseJson(response);
      throw new Error(errorPayload?.message || getWeatherServiceErrorMessage());
    }

    return response.json();
  }

  async function safeParseJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  function renderWeather(weatherData, forecastData, isFallback = false) {
    lastWeatherSnapshot = weatherData;
    currentLocationLabel = `${weatherData.name}, ${weatherData.sys.country}`;
    const currentSnapshot = buildCurrentSnapshot(weatherData, isFallback);
    currentWeatherSnapshot = currentSnapshot;
    currentHeroBaseline = currentSnapshot;

    activeForecastDays = buildInteractiveForecastDays(forecastData, weatherData, currentSnapshot);
    selectForecastDay(0);
  }

  function renderDateTime(weatherData) {
    if (currentClockInterval) {
      clearInterval(currentClockInterval);
    }

    const updateClock = () => {
      dateTimeEl.textContent = formatLocalDate(new Date(), weatherData.timezone);
    };

    updateClock();
    currentClockInterval = setInterval(updateClock, 60000);
  }

  function renderForecast(forecastData, activeIndex = 0) {
    forecastCards.innerHTML = "";

    const safeForecast = Array.isArray(forecastData) && forecastData.length
      ? forecastData.slice(0, 7)
      : fallbackForecast;

    safeForecast.forEach((forecast, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "forecast-card glass-tile";
      const forecastTheme = forecast.snapshot?.theme || forecast.condition || "clouds";
      if (index === activeIndex) {
        card.classList.add("is-active");
      }
      card.innerHTML = `
        <p class="forecast-day">${forecast.day}</p>
        <p class="forecast-date">${forecast.fullDate || forecast.day}</p>
        <div class="forecast-icon">${conditionIconMap[forecastTheme] || conditionIconMap.clouds}</div>
        <p class="forecast-range"><strong>${Math.round(forecast.max)}\u00B0</strong> / ${Math.round(forecast.min)}\u00B0</p>
      `;
      card.addEventListener("click", () => {
        selectForecastDay(index);
      });
      forecastCards.appendChild(card);
    });
  }

  function selectForecastDay(index) {
    const safeIndex = Math.max(0, Math.min(index, activeForecastDays.length - 1));
    const selectedForecast = activeForecastDays[safeIndex];

    if (!selectedForecast) {
      return;
    }

    activeHourlyForecast = selectedForecast.hourlyForecast
      || buildFallbackHourlyForecastForDay(safeIndex, lastWeatherSnapshot, currentHeroBaseline);

    const initialHourlyIndex = getRepresentativeHourlyIndex(activeHourlyForecast, safeIndex, lastWeatherSnapshot?.timezone || 0);
    const initialHourlySnapshot = activeHourlyForecast[initialHourlyIndex]?.snapshot || {};
    const selectedSnapshot = safeIndex === 0 && currentWeatherSnapshot
      ? {
          ...currentWeatherSnapshot,
          locationLabel: currentLocationLabel,
          liveClock: true,
          weatherData: lastWeatherSnapshot,
          dateText: "",
        }
      : mergeHeroSnapshot(
          buildSelectedForecastSnapshot(
            selectedForecast.snapshot || buildForecastSnapshotFromFallback(selectedForecast, safeIndex),
            initialHourlySnapshot,
            selectedForecast,
            safeIndex
          )
        );

    currentHeroBaseline = selectedSnapshot;
    renderHeroSnapshot(selectedSnapshot);
    renderForecast(activeForecastDays, safeIndex);
    renderHourlyForecast(activeHourlyForecast, initialHourlyIndex, true);
  }

  function renderHourlyForecast(hourlyData, activeIndex = 0, resetScroll = false) {
    hourlyCards.innerHTML = "";
    hourlyChart.innerHTML = "";

    const safeHourly = Array.isArray(hourlyData) && hourlyData.length
      ? hourlyData.slice(0, 24)
      : buildFallbackHourlyForecastForDay(0, fallbackWeather, currentHeroBaseline || buildCurrentSnapshot(fallbackWeather, true));

    const boundedIndex = Math.max(0, Math.min(activeIndex, safeHourly.length - 1));

    safeHourly.forEach((entry, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "hourly-card glass-tile";
      if (index === boundedIndex) {
        card.classList.add("is-active");
      }
      card.innerHTML = `
        <p class="hourly-time">${entry.shortLabel}</p>
        <div class="hourly-icon">${conditionIconMap[entry.condition] || conditionIconMap.clouds}</div>
        <p class="hourly-precip">${Math.round(entry.precip)}%</p>
        <p class="hourly-temp">${Math.round(entry.temp)}\u00B0</p>
      `;
      card.addEventListener("click", () => {
        renderHeroSnapshot(mergeHeroSnapshot(entry.snapshot || {}));
        renderHourlyForecast(activeHourlyForecast, index, false);
      });
      hourlyCards.appendChild(card);
    });

    const chartMarkup = buildHourlyChartMarkup(safeHourly, boundedIndex);
    hourlyChart.innerHTML = chartMarkup;

    if (resetScroll) {
      requestAnimationFrame(() => {
        hourlyChart.scrollLeft = 0;
        if (hourlyRailShell) {
          hourlyRailShell.scrollLeft = 0;
        }
      });
    }
  }

  function buildForecastModel(forecastData, weatherData) {
    const currentDayKey = getCurrentLocalDayKey(weatherData.timezone || 0);

    if (Array.isArray(forecastData)) {
      return ensureSevenForecastDays(
        forecastData.slice(0, 7).map((entry, index) => ({
          ...entry,
          day: index === 0 ? "Today" : entry.day,
          fullDate: entry.fullDate || getRelativeForecastDate(index, weatherData.timezone),
          dayKey: entry.dayKey || getRelativeDayKey(index, weatherData.timezone || 0),
          snapshot: entry.snapshot || buildForecastSnapshotFromFallback(entry, index),
        })),
        weatherData
      );
    }

    if (forecastData && Array.isArray(forecastData.daily) && forecastData.daily.length) {
      return ensureSevenForecastDays(
        forecastData.daily
          .filter((entry) => getDayKey(getShiftedDate(entry.dt, weatherData.timezone)) >= currentDayKey)
          .slice(0, 7)
          .map((entry, index) => ({
          day: index === 0 ? "Today" : formatWeekday(entry.dt, weatherData.timezone),
          fullDate: formatForecastDate(entry.dt, weatherData.timezone),
          dayKey: getDayKey(getShiftedDate(entry.dt, weatherData.timezone)),
          condition: classifyCondition(entry.weather),
          min: entry.temp.min,
          max: entry.temp.max,
          snapshot: buildDailySnapshot(entry, weatherData, index),
          })),
        weatherData
      );
    }

    if (!forecastData || !Array.isArray(forecastData.list) || !forecastData.list.length) {
      return ensureSevenForecastDays(
        fallbackForecast.map((entry, index) => ({
          ...entry,
          snapshot: buildForecastSnapshotFromFallback(entry, index),
        })),
        weatherData
      );
    }

    const timezoneOffset = weatherData.timezone || 0;
    const groupedByDay = new Map();

    forecastData.list.forEach((entry) => {
      const date = getShiftedDate(entry.dt, timezoneOffset);
      const dayKey = getDayKey(date);
      const hour = date.getUTCHours();

      if (!groupedByDay.has(dayKey)) {
        groupedByDay.set(dayKey, {
          date,
          temps: [],
          entries: [],
          sourceEntry: entry,
        });
      }

      const dayGroup = groupedByDay.get(dayKey);
      dayGroup.temps.push(entry.main.temp);
      dayGroup.entries.push({
        hour,
        condition: classifyWeather({ weather: entry.weather, timezone: timezoneOffset }),
      });
    });

    const normalized = Array.from(groupedByDay.entries())
      .filter(([dayKey]) => dayKey >= currentDayKey)
      .map(([, group]) => group)
      .sort((a, b) => a.date - b.date)
      .slice(0, 7)
      .map((group, index) => ({
        day: index === 0 ? "Today" : group.date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
        fullDate: group.date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        dayKey: getDayKey(group.date),
        condition: pickRepresentativeCondition(group.entries),
        min: Math.min(...group.temps),
        max: Math.max(...group.temps),
        snapshot: buildListForecastSnapshot(group, weatherData, index),
      }));

    return ensureSevenForecastDays(normalized, weatherData);
  }

  function buildInteractiveForecastDays(forecastData, weatherData, currentSnapshot) {
    const days = buildForecastModel(forecastData, weatherData);
    const hourlyBuckets = buildHourlyForecastBuckets(forecastData, weatherData, currentSnapshot);

    if (days.length) {
      days[0] = {
        ...days[0],
        snapshot: currentSnapshot,
      };
    }

    return days.map((day, index) => {
      const hourlyForecast = normalizeHourlyForecastForDay(
        hourlyBuckets.get(day.dayKey),
        index,
        weatherData,
        currentSnapshot
      );
      const representativeHour = getRepresentativeHourlyIndex(hourlyForecast, index, weatherData.timezone || 0);
      const representativeEntry = hourlyForecast[representativeHour] || hourlyForecast.find(Boolean);

      return {
        ...day,
        snapshot: buildDaySnapshot(day.snapshot, hourlyForecast, weatherData, currentSnapshot, index),
        hourlyForecast,
      };
    });
  }

  function buildHourlyForecastBuckets(forecastData, weatherData, currentSnapshot) {
    const buckets = new Map();

    if (forecastData && Array.isArray(forecastData.hourly) && forecastData.hourly.length) {
      forecastData.hourly.slice(0, 48).forEach((entry, index) => {
        const dayKey = getDayKey(getShiftedDate(entry.dt, weatherData.timezone || 0));
        const theme = classifyTimedCondition(entry.weather, entry.dt, weatherData.timezone || 0);
        const hourlyEntry = {
          timestamp: entry.dt,
          label: index === 0 ? "Now" : formatUnixTime(entry.dt, weatherData.timezone),
          shortLabel: index === 0 ? "Now" : formatCompactHour(entry.dt, weatherData.timezone),
          temp: entry.temp,
          precip: Math.round((entry.pop || 0) * 100),
          condition: theme,
          isEstimated: false,
          snapshot: {
            temp: entry.temp,
            conditionText: toTitleCase(entry.weather[0].description),
            feelsLike: entry.feels_like ?? entry.temp,
            humidity: entry.humidity ?? null,
            windSpeed: Math.round((entry.wind_speed || 0) * 3.6),
            pressure: entry.pressure ?? null,
            visibilityText: typeof entry.visibility === "number" ? `${Math.round(entry.visibility / 1000)} km` : null,
            uvIndexText: typeof entry.uvi === "number" ? String(Math.round(entry.uvi)) : null,
            statusText: index === 0 ? weatherThemes[theme].status : `${formatUnixTime(entry.dt, weatherData.timezone)} outlook`,
            dateText: formatHourlyDate(entry.dt, weatherData.timezone),
            locationLabel: currentLocationLabel,
            theme,
            liveClock: false,
          },
        };

        if (!buckets.has(dayKey)) {
          buckets.set(dayKey, []);
        }

        if (buckets.get(dayKey).length < 24) {
          buckets.get(dayKey).push(hourlyEntry);
        }
      });

      return buckets;
    }

    if (forecastData && Array.isArray(forecastData.list) && forecastData.list.length) {
      forecastData.list.slice(0, 40).forEach((entry, index) => {
        const dayKey = getDayKey(getShiftedDate(entry.dt, weatherData.timezone || 0));
        const theme = classifyTimedCondition(entry.weather, entry.dt, weatherData.timezone || 0);
        const hourlyEntry = {
          timestamp: entry.dt,
          label: index === 0 ? "Now" : formatUnixTime(entry.dt, weatherData.timezone),
          shortLabel: index === 0 ? "Now" : formatCompactHour(entry.dt, weatherData.timezone),
          temp: entry.main.temp,
          precip: Math.round((entry.pop || 0) * 100),
          condition: theme,
          isEstimated: false,
          snapshot: {
            temp: entry.main.temp,
            conditionText: toTitleCase(entry.weather[0].description),
            feelsLike: entry.main.feels_like ?? entry.main.temp,
            humidity: entry.main.humidity ?? null,
            windSpeed: Math.round((entry.wind.speed || 0) * 3.6),
            pressure: entry.main.pressure ?? null,
            visibilityText: typeof entry.visibility === "number" ? `${Math.round(entry.visibility / 1000)} km` : null,
            uvIndexText: null,
            statusText: index === 0 ? weatherThemes[theme].status : `${formatUnixTime(entry.dt, weatherData.timezone)} outlook`,
            dateText: formatHourlyDate(entry.dt, weatherData.timezone),
            locationLabel: currentLocationLabel,
            theme,
            liveClock: false,
          },
        };

        if (!buckets.has(dayKey)) {
          buckets.set(dayKey, []);
        }

        if (buckets.get(dayKey).length < 24) {
          buckets.get(dayKey).push(hourlyEntry);
        }
      });

      return buckets;
    }

    const fallbackDays = ensureSevenForecastDays([], weatherData);
    fallbackDays.forEach((day, index) => {
      buckets.set(day.dayKey, buildFallbackHourlyForecastForDay(index, weatherData, currentSnapshot));
    });

    return buckets;
  }

  function normalizeHourlyForecastForDay(entries, dayIndex, weatherData, currentSnapshot) {
    const baseEntries = buildFallbackHourlyForecastForDay(dayIndex, weatherData, currentSnapshot);

    if (!Array.isArray(entries) || !entries.length) {
      return finalizeHourlyLabels(baseEntries, dayIndex, weatherData.timezone || 0);
    }

    entries.forEach((entry, index) => {
      const hourIndex = typeof entry.timestamp === "number"
        ? getShiftedDate(entry.timestamp, weatherData.timezone || 0).getUTCHours()
        : Math.min(index, 23);

      const boundedHourIndex = Math.max(0, Math.min(hourIndex, 23));
      baseEntries[boundedHourIndex] = {
        ...baseEntries[boundedHourIndex],
        ...entry,
      };
    });

    return finalizeHourlyLabels(baseEntries, dayIndex, weatherData.timezone || 0);
  }

  function finalizeHourlyLabels(hourlyEntries, dayIndex, timezoneOffset) {
    const currentLocalHour = getCurrentLocalHour(timezoneOffset);

    return hourlyEntries.map((entry, index) => {
      if (!entry) {
        return entry;
      }

      const isNowSlot = dayIndex === 0 && index === currentLocalHour;
      const timestamp = typeof entry.timestamp === "number"
        ? entry.timestamp
        : getStartOfForecastDay(dayIndex, timezoneOffset) + index * 3600;

      return {
        ...entry,
        label: isNowSlot ? "Now" : formatUnixTime(timestamp, timezoneOffset),
        shortLabel: isNowSlot ? "Now" : formatCompactHour(timestamp, timezoneOffset),
      };
    });
  }

  function buildHourlyChartMarkup(hourlyData, activeIndex) {
    const chartHeight = 210;
    const chartWidth = Math.max(760, hourlyData.length * 96);
    const topPadding = 28;
    const bottomPadding = 44;
    const leftPadding = 32;
    const usableHeight = chartHeight - topPadding - bottomPadding;
    const stepX = hourlyData.length > 1 ? (chartWidth - leftPadding * 2) / (hourlyData.length - 1) : 0;
    const temps = hourlyData.map((entry) => entry.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = Math.max(1, maxTemp - minTemp);

    const points = hourlyData.map((entry, index) => {
      const x = leftPadding + stepX * index;
      const normalized = (entry.temp - minTemp) / range;
      const y = topPadding + (usableHeight - normalized * usableHeight);
      return { x, y, entry };
    });

    const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    const activePoint = points[activeIndex] || points[0];

    return `
      <div class="hourly-chart-canvas" style="width:${chartWidth}px">
        <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="hourly-chart-svg" role="img" aria-label="Hourly forecast temperature trend">
          <defs>
            <linearGradient id="hourly-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255,255,255,0.2)"></stop>
              <stop offset="100%" stop-color="rgba(255,255,255,0.02)"></stop>
            </linearGradient>
          </defs>
          <path d="${pathData} L ${points[points.length - 1].x} ${chartHeight - bottomPadding + 10} L ${points[0].x} ${chartHeight - bottomPadding + 10} Z" class="hourly-area"></path>
          <path d="${pathData}" class="hourly-line"></path>
          ${points.map((point, index) => `
            <g class="hourly-point ${index === activeIndex ? "is-active" : ""}">
              <circle cx="${point.x}" cy="${point.y}" r="${index === activeIndex ? 6 : 4}"></circle>
            </g>
          `).join("")}
        </svg>
        <div class="hourly-chart-tooltip" style="left:${Math.max(24, Math.min(activePoint.x - 78, chartWidth - 180))}px; top:${Math.max(22, activePoint.y + 16)}px;">
          <strong>${activePoint.entry.label}</strong>
          <span><i class="hourly-key is-temp"></i>Temp: ${Math.round(activePoint.entry.temp)}\u00B0C</span>
          <span><i class="hourly-key is-precip"></i>Precip: ${Math.round(activePoint.entry.precip)}%</span>
        </div>
      </div>
    `;
  }

  function renderHeroSnapshot(snapshot) {
    const theme = snapshot.theme || "clouds";

    if (snapshot.liveClock) {
      renderDateTime(snapshot.weatherData);
    } else {
      if (currentClockInterval) {
        clearInterval(currentClockInterval);
      }
      dateTimeEl.textContent = snapshot.dateText;
    }

    temperatureEl.textContent = snapshot.temp === null || snapshot.temp === undefined
      ? "--"
      : `${Math.round(snapshot.temp)}\u00B0C`;
    conditionEl.textContent = snapshot.conditionText || "--";
    cityNameEl.textContent = snapshot.locationLabel || currentLocationLabel;
    feelsLikeEl.textContent = formatMetricValue(snapshot.feelsLike, "\u00B0C");
    humidityEl.textContent = formatMetricValue(snapshot.humidity, "%");
    windSpeedEl.textContent = formatMetricValue(snapshot.windSpeed, " km/h");
    pressureEl.textContent = formatMetricValue(snapshot.pressure, " hPa");
    visibilityEl.textContent = snapshot.visibilityText || "--";
    uvIndexEl.textContent = snapshot.uvIndexText || "--";
    statusChip.textContent = snapshot.statusText || weatherThemes[theme]?.status || weatherThemes.clouds.status;

    weatherIconEl.innerHTML = conditionIconMap[theme] || conditionIconMap.clouds;
    weatherIconWrap.dataset.weather = theme;
    heroCopyEl.style.setProperty("--hero-art", `url("${cardArtMap[theme] || cardArtMap.clear}")`);
    applyWeatherTheme(theme);
  }

  function mergeHeroSnapshot(snapshot) {
    const baseline = currentHeroBaseline || {};

    return {
      ...baseline,
      ...snapshot,
      temp: preferSnapshotValue(snapshot.temp, baseline.temp),
      feelsLike: preferSnapshotValue(snapshot.feelsLike, baseline.feelsLike),
      humidity: preferSnapshotValue(snapshot.humidity, baseline.humidity),
      windSpeed: preferSnapshotValue(snapshot.windSpeed, baseline.windSpeed),
      pressure: preferSnapshotValue(snapshot.pressure, baseline.pressure),
      visibilityText: preferSnapshotText(snapshot.visibilityText, baseline.visibilityText),
      uvIndexText: preferSnapshotText(snapshot.uvIndexText, baseline.uvIndexText),
      locationLabel: preferSnapshotText(snapshot.locationLabel, baseline.locationLabel),
      statusText: preferSnapshotText(snapshot.statusText, baseline.statusText),
      conditionText: preferSnapshotText(snapshot.conditionText, baseline.conditionText),
      dateText: preferSnapshotText(snapshot.dateText, baseline.dateText),
      theme: preferSnapshotText(snapshot.theme, baseline.theme),
    };
  }

  function buildCurrentSnapshot(weatherData, isFallback) {
    const currentTheme = classifyWeather(weatherData);
    const visibilityInKm = typeof weatherData.visibility === "number"
      ? `${Math.round(weatherData.visibility / 1000)} km`
      : null;

    return {
      temp: weatherData.main.temp,
      conditionText: toTitleCase(weatherData.weather[0].description),
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round((weatherData.wind.speed || 0) * 3.6),
      pressure: weatherData.main.pressure,
      visibilityText: visibilityInKm,
      uvIndexText: estimateUvIndex(currentTheme, weatherData),
      statusText: isFallback ? "Preview mode" : weatherThemes[currentTheme].status,
      dateText: "",
      locationLabel: currentLocationLabel,
      theme: currentTheme,
      liveClock: true,
      weatherData,
    };
  }

  function buildDailySnapshot(entry, weatherData, index) {
    const theme = classifyCondition(entry.weather);
    return {
      temp: entry.temp.day,
      conditionText: toTitleCase(entry.weather[0].description),
      feelsLike: entry.feels_like?.day ?? entry.temp.day,
      humidity: entry.humidity ?? estimateHumidity(theme, index),
      windSpeed: Math.round((entry.wind_speed || 0) * 3.6),
      pressure: entry.pressure ?? estimatePressure(theme, index),
      visibilityText: estimateVisibilityText(theme),
      uvIndexText: typeof entry.uvi === "number" ? String(Math.round(entry.uvi)) : estimateForecastUvIndex(theme, index),
      statusText: index === 0 ? weatherThemes[theme].status : `${formatWeekday(entry.dt, weatherData.timezone)} forecast`,
      dateText: formatForecastDate(entry.dt, weatherData.timezone),
      locationLabel: currentLocationLabel,
      theme,
      liveClock: false,
    };
  }

  function buildListForecastSnapshot(group, weatherData, index) {
    const theme = pickRepresentativeCondition(group.entries);
    const representative = group.sourceEntry;
    return {
      temp: average(group.temps),
      conditionText: toTitleCase(representative.weather[0].description),
      feelsLike: representative.main.feels_like ?? average(group.temps),
      humidity: representative.main.humidity ?? estimateHumidity(theme, index),
      windSpeed: Math.round((representative.wind.speed || 0) * 3.6),
      pressure: representative.main.pressure ?? estimatePressure(theme, index),
      visibilityText: representative.visibility ? `${Math.round(representative.visibility / 1000)} km` : estimateVisibilityText(theme),
      uvIndexText: estimateForecastUvIndex(theme, index),
      statusText: index === 0 ? weatherThemes[theme].status : `${group.date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })} forecast`,
      dateText: group.date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      locationLabel: currentLocationLabel,
      theme,
      liveClock: false,
    };
  }

  function buildForecastSnapshotFromFallback(forecast, index) {
    const dateText = forecast.fullDate || getRelativeForecastDate(index, fallbackWeather.timezone);
    const averageTemp = average([forecast.min, forecast.max]);
    const condition = forecast.condition;

    return {
      temp: averageTemp,
      conditionText: toTitleCase(condition),
      feelsLike: averageTemp + getConditionTemperatureOffset(condition),
      humidity: estimateHumidity(condition, index),
      windSpeed: estimateWindSpeed(condition, index),
      pressure: estimatePressure(condition, index),
      visibilityText: estimateVisibilityText(condition),
      uvIndexText: estimateForecastUvIndex(condition, index),
      statusText: index === 0 ? "Preview mode" : `${forecast.day} forecast`,
      dateText,
      locationLabel: currentLocationLabel,
      theme: condition,
      liveClock: false,
    };
  }

  function buildFallbackHourlyForecastForDay(dayIndex, weatherData, currentSnapshot) {
    return Array.from({ length: 24 }, (_, hourIndex) => {
      const template = fallbackHourlyForecast[(dayIndex * 3 + hourIndex) % fallbackHourlyForecast.length];
      const tempOffset = dayIndex * 0.6 - Math.abs(12 - hourIndex) * 0.12;
      const precip = Math.max(0, Math.min(100, template.precip + dayIndex * 4 - Math.abs(13 - hourIndex)));
      const dayStart = getStartOfForecastDay(dayIndex, weatherData.timezone || fallbackWeather.timezone);
      const dt = dayStart + hourIndex * 3600;
      const timedCondition = classifyTimedCondition(
        [{ main: template.condition, description: template.condition }],
        dt,
        weatherData.timezone || fallbackWeather.timezone
      );

      const entry = {
        timestamp: dt,
        label: hourIndex === getCurrentLocalHour(weatherData.timezone || fallbackWeather.timezone) && dayIndex === 0
          ? "Now"
          : formatUnixTime(dt, weatherData.timezone || fallbackWeather.timezone),
        shortLabel: hourIndex === getCurrentLocalHour(weatherData.timezone || fallbackWeather.timezone) && dayIndex === 0
          ? "Now"
          : formatCompactHour(dt, weatherData.timezone || fallbackWeather.timezone),
        temp: Math.round((template.temp + tempOffset) * 10) / 10,
        precip,
        condition: timedCondition,
        isEstimated: true,
      };

      return {
        ...entry,
        snapshot: buildHourlySnapshotFromFallback(entry, dt, weatherData, currentSnapshot, dayIndex, hourIndex),
      };
    });
  }

  function buildHourlySnapshotFromFallback(entry, timestamp, weatherData, currentSnapshot, dayIndex = 0, hourIndex = 0) {
    const hourOfDay = getShiftedDate(timestamp, weatherData.timezone || fallbackWeather.timezone).getUTCHours();
    const snapshot = {
      ...currentSnapshot,
      temp: entry.temp,
      conditionText: toTitleCase(entry.condition),
      feelsLike: entry.temp + getConditionTemperatureOffset(entry.condition),
      humidity: estimateHourlyHumidity(entry.condition, hourOfDay, currentSnapshot?.humidity, dayIndex, hourIndex),
      windSpeed: estimateHourlyWindSpeed(entry.condition, hourOfDay, currentSnapshot?.windSpeed, dayIndex, hourIndex),
      pressure: estimateHourlyPressure(entry.condition, hourOfDay, currentSnapshot?.pressure, dayIndex, hourIndex),
      visibilityText: estimateVisibilityText(entry.condition, hourOfDay),
      uvIndexText: estimateHourlyUvIndex(entry.condition, hourOfDay),
      statusText: entry.label === "Now" ? "Preview mode" : `${entry.label} outlook`,
      dateText: formatHourlyDate(timestamp, weatherData.timezone || fallbackWeather.timezone),
      locationLabel: currentLocationLabel,
      theme: entry.condition,
      liveClock: false,
    };

    return snapshot;
  }

  function ensureSevenForecastDays(days, weatherData) {
    const normalized = Array.isArray(days) ? [...days] : [];

    while (normalized.length < 7) {
      const index = normalized.length;
      const template = fallbackForecast[index % fallbackForecast.length];
      normalized.push({
        ...template,
        day: index === 0 ? "Today" : getRelativeWeekday(index, weatherData.timezone),
        fullDate: getRelativeForecastDate(index, weatherData.timezone),
        dayKey: getRelativeDayKey(index, weatherData.timezone || 0),
        snapshot: buildForecastSnapshotFromFallback(template, index),
      });
    }

    return normalized.slice(0, 7);
  }

  function buildDaySnapshot(daySnapshot, hourlyForecast, weatherData, currentSnapshot, dayIndex) {
    const representativeHour = getRepresentativeHourlyIndex(hourlyForecast, dayIndex, weatherData.timezone || 0);
    const hourlyReference = hourlyForecast[representativeHour] || hourlyForecast.find(Boolean);
    const hourlySnapshot = hourlyReference?.snapshot || {};
    const baseDaySnapshot = daySnapshot || {};
    const resolvedTheme = preferSnapshotText(hourlySnapshot.theme, baseDaySnapshot.theme ?? currentSnapshot?.theme) || "clouds";
    const resolvedUvIndexText = resolveSelectedDayUvIndex(
      hourlySnapshot.uvIndexText,
      baseDaySnapshot.uvIndexText,
      resolvedTheme,
      dayIndex,
      representativeHour
    );

    return {
      ...baseDaySnapshot,
      ...hourlySnapshot,
      temp: preferSnapshotValue(baseDaySnapshot.temp, hourlySnapshot.temp ?? currentSnapshot?.temp),
      feelsLike: preferSnapshotValue(hourlySnapshot.feelsLike, baseDaySnapshot.feelsLike ?? currentSnapshot?.feelsLike),
      humidity: preferSnapshotValue(hourlySnapshot.humidity, baseDaySnapshot.humidity ?? currentSnapshot?.humidity),
      windSpeed: preferSnapshotValue(hourlySnapshot.windSpeed, baseDaySnapshot.windSpeed ?? currentSnapshot?.windSpeed),
      pressure: preferSnapshotValue(hourlySnapshot.pressure, baseDaySnapshot.pressure ?? currentSnapshot?.pressure),
      visibilityText: preferSnapshotText(hourlySnapshot.visibilityText, baseDaySnapshot.visibilityText ?? currentSnapshot?.visibilityText),
      uvIndexText: resolvedUvIndexText,
      theme: resolvedTheme,
      conditionText: preferSnapshotText(hourlySnapshot.conditionText, baseDaySnapshot.conditionText ?? currentSnapshot?.conditionText),
      statusText: preferSnapshotText(hourlySnapshot.statusText, baseDaySnapshot.statusText ?? currentSnapshot?.statusText),
      dateText: preferSnapshotText(baseDaySnapshot.dateText, hourlySnapshot.dateText ?? currentSnapshot?.dateText),
      locationLabel: preferSnapshotText(baseDaySnapshot.locationLabel, hourlySnapshot.locationLabel ?? currentLocationLabel),
      liveClock: false,
    };
  }

  function buildSelectedForecastSnapshot(daySnapshot, hourlySnapshot, forecastDay, dayIndex) {
    const safeDaySnapshot = daySnapshot || {};
    const safeHourlySnapshot = hourlySnapshot || {};
    const resolvedTheme = preferSnapshotText(safeHourlySnapshot.theme, safeDaySnapshot.theme) || "clouds";
    const timezoneOffset = lastWeatherSnapshot?.timezone || 0;
    const fallbackDateText = formatForecastDateWithCurrentTime(
      forecastDay?.fullDate || getRelativeForecastDate(dayIndex, timezoneOffset),
      timezoneOffset
    );

    return {
      ...safeDaySnapshot,
      ...safeHourlySnapshot,
      temp: preferSnapshotValue(safeHourlySnapshot.temp, safeDaySnapshot.temp),
      feelsLike: preferSnapshotValue(safeHourlySnapshot.feelsLike, safeDaySnapshot.feelsLike),
      humidity: preferSnapshotValue(safeHourlySnapshot.humidity, safeDaySnapshot.humidity),
      windSpeed: preferSnapshotValue(safeHourlySnapshot.windSpeed, safeDaySnapshot.windSpeed),
      pressure: preferSnapshotValue(safeHourlySnapshot.pressure, safeDaySnapshot.pressure),
      visibilityText: preferSnapshotText(safeHourlySnapshot.visibilityText, safeDaySnapshot.visibilityText),
      uvIndexText: preferSnapshotText(safeHourlySnapshot.uvIndexText, safeDaySnapshot.uvIndexText),
      theme: resolvedTheme,
      conditionText: preferSnapshotText(safeHourlySnapshot.conditionText, safeDaySnapshot.conditionText),
      statusText: preferSnapshotText(
        safeHourlySnapshot.statusText,
        safeDaySnapshot.statusText || `${forecastDay?.day || "Forecast"} outlook`
      ),
      dateText: preferSnapshotText(
        dayIndex === 0 ? safeHourlySnapshot.dateText : "",
        safeDaySnapshot.dateText || fallbackDateText
      ),
      locationLabel: preferSnapshotText(safeHourlySnapshot.locationLabel, safeDaySnapshot.locationLabel || currentLocationLabel),
      liveClock: false,
    };
  }

  function getRepresentativeHourlyIndex(hourlyForecast, dayIndex, timezoneOffset) {
    const preferredIndex = getCurrentLocalHour(timezoneOffset);

    if (Array.isArray(hourlyForecast) && hourlyForecast[preferredIndex] && !hourlyForecast[preferredIndex].isEstimated) {
      return preferredIndex;
    }

    if (!Array.isArray(hourlyForecast) || !hourlyForecast.length) {
      return 0;
    }

    const liveIndices = hourlyForecast
      .map((entry, index) => ({ entry, index }))
      .filter((item) => item.entry && !item.entry.isEstimated);

    if (liveIndices.length) {
      return liveIndices.reduce((best, current) => {
        const bestDistance = Math.abs(best.index - preferredIndex);
        const currentDistance = Math.abs(current.index - preferredIndex);
        return currentDistance < bestDistance ? current : best;
      }).index;
    }

    const firstValidIndex = hourlyForecast.findIndex(Boolean);
    return firstValidIndex === -1 ? 0 : firstValidIndex;
  }

  function resolveSelectedDayUvIndex(hourlyUvIndexText, dayUvIndexText, theme, dayIndex, representativeHour) {
    const liveUv = preferSnapshotText(hourlyUvIndexText, "");
    if (liveUv) {
      return liveUv;
    }

    const forecastUv = preferSnapshotText(dayUvIndexText, "");
    if (forecastUv) {
      const adjustedUv = Math.max(0, Number(forecastUv) - Math.floor(dayIndex / 2));
      return String(adjustedUv);
    }

    const hourlyEstimate = Number(estimateHourlyUvIndex(theme, representativeHour));
    const dayAdjustment = Math.floor(dayIndex / 2);
    return String(Math.max(0, hourlyEstimate - dayAdjustment));
  }

  function classifyCondition(weatherEntries) {
    return classifyWeather({
      weather: weatherEntries,
      timezone: 0,
      sys: { sunset: Number.MAX_SAFE_INTEGER },
    }).replace("night", "clear");
  }

  function classifyTimedCondition(weatherEntries, unixSeconds, timezoneOffset) {
    const main = weatherEntries[0].main.toLowerCase();
    const description = weatherEntries[0].description.toLowerCase();
    const isNightHour = isNightHourForTimestamp(unixSeconds, timezoneOffset);

    if (description.includes("thunder")) {
      return "storm";
    }

    if (main.includes("snow")) {
      return "snow";
    }

    if (main.includes("rain") || description.includes("drizzle")) {
      return "rain";
    }

    if (main.includes("mist") || main.includes("fog") || main.includes("haze")) {
      return "mist";
    }

    if (main.includes("clear")) {
      return isNightHour ? "night" : "clear";
    }

    if (main.includes("cloud")) {
      if (isNightHour) {
        return "night";
      }
      if (description.includes("few")) {
        return "few-clouds";
      }
      if (description.includes("scattered")) {
        return "scattered-clouds";
      }
      if (description.includes("overcast")) {
        return "overcast";
      }
      if (description.includes("broken")) {
        return "broken-clouds";
      }
      return isNightHour ? "night" : "clouds";
    }

    return isNightHour ? "night" : "clear";
  }

  function formatWeekday(unixSeconds, timezoneOffset) {
    return getShiftedDate(unixSeconds, timezoneOffset).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "UTC",
    });
  }

  function formatForecastDate(unixSeconds, timezoneOffset) {
    return getShiftedDate(unixSeconds, timezoneOffset).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function getRelativeWeekday(offset, timezoneOffset) {
    const base = getShiftedDate(Math.floor(Date.now() / 1000) + offset * 86400, timezoneOffset || 0);
    return offset === 0
      ? "Today"
      : base.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
  }

  function getRelativeForecastDate(offset, timezoneOffset) {
    const base = getShiftedDate(Math.floor(Date.now() / 1000) + offset * 86400, timezoneOffset || 0);
    return base.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function formatHourlyDate(unixSeconds, timezoneOffset) {
    return getShiftedDate(unixSeconds, timezoneOffset).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  function formatMetricValue(value, suffix) {
    return value === "--" || value === null || value === undefined ? "--" : `${Math.round(value)}${suffix}`;
  }

  function estimateHumidity(theme, index = 0) {
    const ranges = {
      clear: 46,
      clouds: 62,
      rain: 82,
      snow: 78,
      storm: 86,
      mist: 88,
      night: 68,
    };

    return Math.max(28, Math.min(96, (ranges[theme] ?? 60) + index * 2));
  }

  function estimateWindSpeed(theme, index = 0) {
    const ranges = {
      clear: 12,
      clouds: 16,
      rain: 22,
      snow: 18,
      storm: 30,
      mist: 10,
      night: 11,
    };

    return Math.max(4, (ranges[theme] ?? 14) + index);
  }

  function estimatePressure(theme, index = 0) {
    const ranges = {
      clear: 1015,
      clouds: 1011,
      rain: 1006,
      snow: 1008,
      storm: 998,
      mist: 1009,
      night: 1013,
    };

    return (ranges[theme] ?? 1010) - Math.min(index, 4);
  }

  function estimateVisibilityText(theme, hourOfDay = 12) {
    const ranges = {
      clear: 10,
      clouds: 9,
      rain: 6,
      snow: 5,
      storm: 3,
      mist: 2,
      night: 7,
    };

    const baseVisibility = ranges[theme] ?? 8;
    const nightAdjustment = hourOfDay < 6 || hourOfDay >= 19 ? -1 : 0;
    return `${Math.max(1, baseVisibility + nightAdjustment)} km`;
  }

  function estimateForecastUvIndex(theme, index = 0) {
    const ranges = {
      clear: 8,
      clouds: 5,
      rain: 2,
      snow: 6,
      storm: 1,
      mist: 2,
      night: 0,
    };

    return String(Math.max(0, (ranges[theme] ?? 4) - Math.floor(index / 3)));
  }

  function estimateHourlyUvIndex(theme, hourOfDay) {
    if (hourOfDay < 6 || hourOfDay >= 18) {
      return "0";
    }

    const solarWeight = Math.max(0, 1 - Math.abs(12 - hourOfDay) / 6);
    const weatherLimit = Number(estimateForecastUvIndex(theme, 0));
    return String(Math.max(0, Math.round(weatherLimit * solarWeight)));
  }

  function estimateHourlyHumidity(theme, hourOfDay, baselineHumidity, dayIndex = 0, hourIndex = 0) {
    const baseHumidity = baselineHumidity ?? estimateHumidity(theme, 0);
    const humidityDelta = hourOfDay < 7 || hourOfDay > 19 ? 8 : -4;
    const dayDelta = dayIndex * 3;
    const hourWave = Math.round(Math.sin((hourIndex / 24) * Math.PI * 2) * 4);
    return Math.max(28, Math.min(98, baseHumidity + humidityDelta + dayDelta + hourWave));
  }

  function estimateHourlyWindSpeed(theme, hourOfDay, baselineWindSpeed, dayIndex = 0, hourIndex = 0) {
    const baseWindSpeed = baselineWindSpeed ?? estimateWindSpeed(theme, 0);
    const windDelta = hourOfDay >= 12 && hourOfDay <= 17 ? 3 : -1;
    const dayDelta = dayIndex;
    const hourWave = Math.round(Math.cos((hourIndex / 24) * Math.PI * 2) * 2);
    return Math.max(4, baseWindSpeed + windDelta + dayDelta + hourWave);
  }

  function estimateHourlyPressure(theme, hourOfDay, baselinePressure, dayIndex = 0, hourIndex = 0) {
    const basePressure = baselinePressure ?? estimatePressure(theme, 0);
    const pressureDelta = hourOfDay >= 15 && hourOfDay <= 20 ? -2 : 1;
    const dayDelta = -dayIndex;
    const hourWave = Math.round(Math.sin((hourIndex / 24) * Math.PI * 2) * 2);
    return basePressure + pressureDelta + dayDelta + hourWave;
  }

  function getConditionTemperatureOffset(theme) {
    const offsets = {
      clear: 1,
      clouds: 0,
      rain: -1,
      snow: -2,
      storm: -2,
      mist: -1,
      night: -1,
    };

    return offsets[theme] ?? 0;
  }

  function preferSnapshotValue(primary, fallback) {
    return primary === null || primary === undefined || primary === "--" ? fallback : primary;
  }

  function preferSnapshotText(primary, fallback) {
    return primary === null || primary === undefined || primary === "" || primary === "--" ? fallback : primary;
  }

  function average(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function pickRepresentativeCondition(entries) {
    if (!entries.length) {
      return "clouds";
    }

    return entries.reduce((best, current) => {
      const bestDistance = Math.abs(best.hour - 12);
      const currentDistance = Math.abs(current.hour - 12);
      return currentDistance < bestDistance ? current : best;
    }).condition;
  }

  function getShiftedDate(unixSeconds, timezoneOffset) {
    return new Date((unixSeconds + timezoneOffset) * 1000);
  }

  function getCurrentLocalDayKey(timezoneOffset) {
    return getRelativeDayKey(0, timezoneOffset);
  }

  function getRelativeDayKey(offset, timezoneOffset) {
    return getDayKey(getShiftedDate(Math.floor(Date.now() / 1000) + offset * 86400, timezoneOffset || 0));
  }

  function getStartOfForecastDay(dayOffset, timezoneOffset) {
    const shiftedNow = getShiftedDate(Math.floor(Date.now() / 1000), timezoneOffset);
    shiftedNow.setUTCHours(0, 0, 0, 0);
    return Math.floor(shiftedNow.getTime() / 1000) - timezoneOffset + dayOffset * 86400;
  }

  function getCurrentLocalHour(timezoneOffset) {
    return getShiftedDate(Math.floor(Date.now() / 1000), timezoneOffset).getUTCHours();
  }

  function getDayKey(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isNightHourForTimestamp(unixSeconds, timezoneOffset) {
    const localHour = getShiftedDate(unixSeconds, timezoneOffset).getUTCHours();
    return localHour < 6 || localHour >= 18;
  }

  function classifyWeather(weatherData) {
    const main = weatherData.weather[0].main.toLowerCase();
    const description = weatherData.weather[0].description.toLowerCase();
    const isNight = isNightTime(weatherData);

    if (description.includes("thunder")) {
      return "storm";
    }

    if (main.includes("snow")) {
      return "snow";
    }

    if (main.includes("rain") || description.includes("drizzle")) {
      return "rain";
    }

    if (main.includes("mist") || main.includes("fog") || main.includes("haze")) {
      return "mist";
    }

    if (main.includes("clear")) {
      return isNight ? "night" : "clear";
    }

    if (main.includes("cloud")) {
      if (isNight) {
        return "night";
      }
      if (description.includes("few")) {
        return "few-clouds";
      }
      if (description.includes("scattered")) {
        return "scattered-clouds";
      }
      if (description.includes("overcast")) {
        return "overcast";
      }
      if (description.includes("broken")) {
        return "broken-clouds";
      }
      return "clouds";
    }

    return isNight ? "night" : "clear";
  }

  function isNightTime(weatherData) {
    if (!weatherData.sys || !weatherData.sys.sunset) {
      return false;
    }

    const currentUtc = Math.floor(Date.now() / 1000);
    const localSeconds = currentUtc + (weatherData.timezone || 0);
    const hours = new Date(localSeconds * 1000).getUTCHours();
    return hours < 6 || hours >= 18;
  }

  function applyWeatherTheme(theme) {
    Object.values(weatherThemes).forEach((item) => {
      document.body.classList.remove(item.bodyClass);
    });
    document.body.classList.add((weatherThemes[theme] || weatherThemes.clouds).bodyClass);
  }

  function showError(message) {
    errorText.textContent = message;
    errorMessage.hidden = false;
  }

  function hideError() {
    errorMessage.hidden = true;
  }

  function getWeatherServiceErrorMessage() {
    if (window.location.protocol === "file:") {
      return "Run the app with npm run dev and open http://localhost:3000.";
    }

    return "Weather service is unavailable. Make sure the server is running and the API key is valid.";
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported in this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, (error) => {
        const messages = {
          1: "Location access was denied.",
          2: "Current location is unavailable.",
          3: "Location request timed out.",
        };
        reject(new Error(messages[error.code] || "Unable to detect your location."));
      });
    });
  }

  function formatLocalDate(date, timezoneOffset) {
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    const cityTime = new Date(utcTime + timezoneOffset * 1000);

    return cityTime
      .toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", " \u2022");
  }

  function formatForecastDateWithCurrentTime(dateLabel, timezoneOffset) {
    const currentLocalTime = formatCurrentLocalTime(timezoneOffset);
    return `${dateLabel} \u2022 ${currentLocalTime}`;
  }

  function formatCurrentLocalTime(timezoneOffset) {
    const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
    const cityTime = new Date(utcTime + timezoneOffset * 1000);

    return cityTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatUnixTime(unixSeconds, timezoneOffset) {
    const utcDate = new Date((unixSeconds + timezoneOffset) * 1000);
    return utcDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  function formatCompactHour(unixSeconds, timezoneOffset) {
    const utcDate = new Date((unixSeconds + timezoneOffset) * 1000);
    return utcDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      timeZone: "UTC",
    });
  }

  function toTitleCase(value) {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  async function simulateLoading() {
    return new Promise((resolve) => {
      window.setTimeout(resolve, 700);
    });
  }

  function buildDemoWeather(city) {
    return {
      ...fallbackWeather,
      name: city ? toTitleCase(city) : fallbackWeather.name,
    };
  }

  function estimateUvIndex(theme, weatherData) {
    if (isNightTime(weatherData)) {
      return "0";
    }

    const ranges = {
      clear: 8,
      clouds: 5,
      rain: 2,
      snow: 6,
      storm: 1,
      mist: 2,
      night: 0,
    };

    return String(ranges[theme] ?? 4);
  }

});
