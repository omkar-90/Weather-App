const WEATHER_API_BASE = "/api";
const LAST_LOCATION_STORAGE_KEY = "weather-last-location";

const weatherThemes = {
  clear: {
    bodyClass: "weather-clear",
    status: "Bright skies",
  },
  "few-clouds": {
    bodyClass: "weather-few-clouds",
    status: "Mostly sunny",
  },
  "scattered-clouds": {
    bodyClass: "weather-scattered-clouds",
    status: "Partly cloudy",
  },
  "broken-clouds": {
    bodyClass: "weather-broken-clouds",
    status: "Mostly cloudy",
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
    top: "#6faadf",
    bottom: "#3a6d9e",
    glow: "#ffd88a",
    accent: "#edf4ff",
    horizon: "#7a96ba",
    motif: "clouds",
  }),
  "scattered-clouds": createWeatherCardArt({
    top: "#8097b5",
    bottom: "#4b6584",
    glow: "#c8d8f0",
    accent: "#edf4ff",
    horizon: "#8798b2",
    motif: "clouds",
  }),
  "broken-clouds": createWeatherCardArt({
    top: "#5a7295",
    bottom: "#3a5070",
    glow: "#a8c0d8",
    accent: "#d8e8f8",
    horizon: "#6a8aaa",
    motif: "clouds",
  }),
  overcast: createWeatherCardArt({
    top: "#3a4a60",
    bottom: "#222f40",
    glow: "#8a9aac",
    accent: "#c8d2dc",
    horizon: "#4a5a70",
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
  const errorTitle = document.getElementById("error-title");
  const errorText = document.getElementById("error-text");
  const stateLayer = document.getElementById("state-layer");
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
  const heroAside = document.querySelector(".hero-aside");

  let currentClockInterval = null;
  let lastWeatherSnapshot = null;
  let activeForecastDays = [];
  let activeHourlyForecast = [];
  let currentLocationLabel = "";
  let currentHeroBaseline = null;
  let isSyncingHourlyScroll = false;

  initializeTheme();
  bindEvents();
  initializeHourlyScrollSync();
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
      } else {
        showError("Search for a city or allow location access to load live weather.");
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
        forecastData = null;
        warningMessage = "Live forecast is unavailable right now. Showing current live weather only.";
      }

      if (saveLocation) {
        saveLastLocation(weatherData, { city, lat, lon, label: locationLabel });
      }

      cityInput.value = weatherData.name;

      renderWeather(weatherData, forecastData);
      if (warningMessage) {
        showError(warningMessage, "Forecast notice.");
      } else {
        hideError();
      }
    } catch (error) {
      const message = error.message === "Location not found."
        ? error.message
        : "Live weather is unavailable right now. Please try again.";

      showError(message);
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

    const response = await fetch(`${WEATHER_API_BASE}/weather?${query}`);
    if (!response.ok) {
      const errorPayload = await safeParseJson(response);
      throw new Error(errorPayload?.message || (response.status === 404 ? "Location not found." : "Weather service is unavailable."));
    }

    return response.json();
  }

  async function fetchForecast(lat, lon) {
    const response = await fetch(
      `${WEATHER_API_BASE}/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
    );

    if (!response.ok) {
      const errorPayload = await safeParseJson(response);
      throw new Error(errorPayload?.message || "Forecast service is unavailable.");
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

  function renderWeather(weatherData, forecastData) {
    lastWeatherSnapshot = weatherData;
    currentLocationLabel = `${weatherData.name}, ${weatherData.sys.country}`;
    const currentSnapshot = buildCurrentSnapshot(weatherData);
    currentHeroBaseline = currentSnapshot;

    // Trigger staggered entrance for mini-stat tiles
    if (heroAside) {
      heroAside.classList.remove("is-animating");
      void heroAside.offsetWidth; // force reflow to restart animation
      heroAside.classList.add("is-animating");
    }

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
      : [];

    safeForecast.forEach((forecast, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "forecast-card glass-tile";
      if (index === activeIndex) {
        card.classList.add("is-active");
      }
      card.innerHTML = `
        <p class="forecast-day">${forecast.day}</p>
        <p class="forecast-date">${forecast.fullDate || forecast.day}</p>
        <div class="forecast-icon">${conditionIconMap[forecast.condition] || conditionIconMap.clouds}</div>
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

    activeHourlyForecast = selectedForecast.hourlyForecast || [];

    const initialHourlyIndex = getRepresentativeHourlyIndex(activeHourlyForecast, safeIndex, lastWeatherSnapshot?.timezone || 0);
    const initialHourlySnapshot = activeHourlyForecast[initialHourlyIndex]?.snapshot || {};
    const selectedSnapshot = mergeHeroSnapshot({
      ...(selectedForecast.snapshot || {}),
      ...initialHourlySnapshot,
    });

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
      : [];

    if (!safeHourly.length) {
      hourlyCards.innerHTML = `
        <div class="hourly-empty glass-tile">
          <p>Hourly forecast is unavailable for this selection.</p>
        </div>
      `;
      return;
    }

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
        <p class="hourly-precip">${formatPercentValue(entry.precip)}</p>
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

    // Bind event listeners to interactive columns in the SVG chart
    const rects = hourlyChart.querySelectorAll(".chart-interactive-rect");
    rects.forEach((rect) => {
      rect.addEventListener("click", () => {
        const index = parseInt(rect.getAttribute("data-index"), 10);
        renderHeroSnapshot(mergeHeroSnapshot(safeHourly[index].snapshot || {}));
        renderHourlyForecast(activeHourlyForecast, index, false);
      });
    });

    if (resetScroll) {
      requestAnimationFrame(() => {
        const targetScrollLeft = Math.max(0, boundedIndex * 96 - 24);
        hourlyChart.scrollLeft = targetScrollLeft;
        if (hourlyRailShell) {
          hourlyRailShell.scrollLeft = targetScrollLeft;
        }
      });
    }
  }

  function buildForecastModel(forecastData, weatherData) {
    if (Array.isArray(forecastData)) {
      return forecastData.slice(0, 7).map((entry, index) => ({
        ...entry,
        day: index === 0 ? "Today" : entry.day,
        fullDate: entry.fullDate || "",
        dayKey: entry.dayKey || "",
        snapshot: entry.snapshot || {},
      }));
    }

    if (forecastData && Array.isArray(forecastData.daily) && forecastData.daily.length) {
      return forecastData.daily.slice(0, 7).map((entry, index) => ({
        day: index === 0 ? "Today" : formatWeekday(entry.dt, weatherData.timezone),
        fullDate: formatForecastDate(entry.dt, weatherData.timezone),
        dayKey: getDayKey(getShiftedDate(entry.dt, weatherData.timezone)),
        condition: classifyCondition(entry.weather),
        min: entry.temp.min,
        max: entry.temp.max,
        snapshot: buildDailySnapshot(entry, weatherData, index),
      }));
    }

    if (!forecastData || !Array.isArray(forecastData.list) || !forecastData.list.length) {
      return [{
        day: "Today",
        fullDate: formatLocalDate(new Date(), weatherData.timezone),
        dayKey: getDayKey(getShiftedDate(Math.floor(Date.now() / 1000), weatherData.timezone || 0)),
        condition: classifyWeather(weatherData),
        min: weatherData.main.temp,
        max: weatherData.main.temp,
        snapshot: buildCurrentSnapshot(weatherData, false),
      }];
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

    const normalized = Array.from(groupedByDay.values())
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

    return normalized;
  }

  function buildInteractiveForecastDays(forecastData, weatherData, currentSnapshot) {
    const days = buildForecastModel(forecastData, weatherData);
    const hourlyBuckets = buildHourlyForecastBuckets(forecastData, weatherData, currentSnapshot);
    const currentDayKey = getDayKey(getShiftedDate(Math.floor(Date.now() / 1000), weatherData.timezone || 0));
    const currentHourlyEntry = buildCurrentHourlyEntry(weatherData, currentSnapshot);

    if (days.length) {
      days[0] = {
        ...days[0],
        snapshot: currentSnapshot,
        dayKey: days[0].dayKey || currentDayKey,
      };
    }

    return days.map((day, index) => {
      const hourlyForecast = normalizeHourlyForecastForDay(
        hourlyBuckets.get(day.dayKey),
        index === 0 ? currentHourlyEntry : null
      );

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
      forecastData.hourly.slice(0, 168).forEach((entry, index) => {
        const dayKey = getDayKey(getShiftedDate(entry.dt, weatherData.timezone || 0));
        const theme = classifyCondition(entry.weather);
        const hourlyEntry = {
          timestamp: entry.dt,
          label: formatUnixTime(entry.dt, weatherData.timezone),
          shortLabel: formatCompactHour(entry.dt, weatherData.timezone),
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
            uvIndexText: formatUvIndex(entry.uvi),
            statusText: `${formatUnixTime(entry.dt, weatherData.timezone)} outlook`,
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
        const theme = classifyWeather({
          weather: entry.weather,
          timezone: weatherData.timezone,
          sys: weatherData.sys,
        });
        const hourlyEntry = {
          timestamp: entry.dt,
          label: formatUnixTime(entry.dt, weatherData.timezone),
          shortLabel: formatCompactHour(entry.dt, weatherData.timezone),
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
            uvIndexText: formatUvIndex(entry.uvi),
            statusText: `${formatUnixTime(entry.dt, weatherData.timezone)} outlook`,
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

    return buckets;
  }

  function normalizeHourlyForecastForDay(entries, currentHourlyEntry = null) {
    const normalized = Array.isArray(entries) ? [...entries] : [];

    if (currentHourlyEntry) {
      const currentHourKey = getHourlySlotKey(currentHourlyEntry.timestamp);
      const matchingCurrentSlot = normalized.find((entry) => getHourlySlotKey(entry.timestamp) === currentHourKey);
      const mergedCurrentEntry = mergeCurrentHourlyEntry(currentHourlyEntry, matchingCurrentSlot);
      const withoutCurrentSlot = normalized.filter((entry) => getHourlySlotKey(entry.timestamp) !== currentHourKey);
      return [mergedCurrentEntry, ...withoutCurrentSlot]
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, 24);
    }

    return normalized
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 24);
  }

  function buildCurrentHourlyEntry(weatherData, currentSnapshot) {
    const theme = currentSnapshot.theme || classifyWeather(weatherData);

    return {
      timestamp: Math.floor(Date.now() / 1000),
      label: "Now",
      shortLabel: "Now",
      temp: weatherData.main.temp,
      precip: null,
      condition: theme,
      isEstimated: false,
      snapshot: {
        ...currentSnapshot,
        dateText: formatLocalDate(new Date(), weatherData.timezone),
        liveClock: true,
      },
    };
  }

  function mergeCurrentHourlyEntry(currentEntry, forecastEntry) {
    if (!forecastEntry) {
      return currentEntry;
    }

    return {
      ...forecastEntry,
      ...currentEntry,
      precip: forecastEntry.precip,
      snapshot: {
        ...forecastEntry.snapshot,
        ...currentEntry.snapshot,
        uvIndexText: preferSnapshotText(forecastEntry.snapshot?.uvIndexText, currentEntry.snapshot?.uvIndexText),
      },
    };
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
          ${points.map((point, index) => {
            const isActive = index === activeIndex;
            return `
              <g class="hourly-col ${isActive ? "is-active" : ""}">
                <line x1="${point.x}" y1="${point.y}" x2="${point.x}" y2="${chartHeight - bottomPadding}" class="hourly-gridline" />
                <text x="${point.x}" y="${point.y - 12}" class="hourly-chart-temp" text-anchor="middle">${Math.round(point.entry.temp)}°</text>
                <text x="${point.x}" y="${chartHeight - 16}" class="hourly-chart-time" text-anchor="middle">${point.entry.shortLabel}</text>
                <g class="hourly-point">
                  <circle cx="${point.x}" cy="${point.y}" r="${isActive ? 6 : 4}"></circle>
                </g>
                <rect x="${point.x - stepX / 2}" y="0" width="${stepX}" height="${chartHeight}" fill="transparent" class="chart-interactive-rect" data-index="${index}" style="cursor:pointer; pointer-events:all;"></rect>
              </g>
            `;
          }).join("")}
        </svg>
        <div class="hourly-chart-tooltip" style="left:${Math.max(24, Math.min(activePoint.x - 78, chartWidth - 180))}px; top:${Math.max(22, activePoint.y + 16)}px;">
          <strong>${activePoint.entry.label}</strong>
          <span><i class="hourly-key is-temp"></i>Temp: ${Math.round(activePoint.entry.temp)}\u00B0C</span>
          <span><i class="hourly-key is-precip"></i>Precip: ${formatPercentValue(activePoint.entry.precip)}</span>
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

    // Temperature flip animation
    temperatureEl.classList.remove("is-animating");
    void temperatureEl.offsetWidth;
    temperatureEl.textContent = snapshot.temp === null || snapshot.temp === undefined
      ? "--"
      : `${Math.round(snapshot.temp)}\u00B0C`;
    temperatureEl.classList.add("is-animating");

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

    // Icon pop animation on every theme change
    weatherIconWrap.classList.remove("icon-pop");
    void weatherIconWrap.offsetWidth;
    weatherIconWrap.classList.add("icon-pop");

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

  function buildCurrentSnapshot(weatherData) {
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
      uvIndexText: null,
      statusText: weatherThemes[currentTheme].status,
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
      humidity: entry.humidity ?? null,
      windSpeed: Math.round((entry.wind_speed || 0) * 3.6),
      pressure: entry.pressure ?? null,
      visibilityText: null,
      uvIndexText: formatUvIndex(entry.uvi),
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
      humidity: representative.main.humidity ?? null,
      windSpeed: Math.round((representative.wind.speed || 0) * 3.6),
      pressure: representative.main.pressure ?? null,
      visibilityText: representative.visibility ? `${Math.round(representative.visibility / 1000)} km` : null,
      uvIndexText: null,
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

  function buildDaySnapshot(daySnapshot, hourlyForecast, weatherData, currentSnapshot, dayIndex) {
    const representativeHour = getRepresentativeHourlyIndex(hourlyForecast, dayIndex, weatherData.timezone || 0);
    const hourlyReference = hourlyForecast[representativeHour] || hourlyForecast.find(Boolean);
    const hourlySnapshot = hourlyReference?.snapshot || {};
    const baseDaySnapshot = daySnapshot || {};
    const resolvedTheme = preferSnapshotText(baseDaySnapshot.theme, hourlySnapshot.theme ?? currentSnapshot?.theme) || "clouds";
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
      conditionText: preferSnapshotText(baseDaySnapshot.conditionText, hourlySnapshot.conditionText ?? currentSnapshot?.conditionText),
      statusText: preferSnapshotText(baseDaySnapshot.statusText, hourlySnapshot.statusText ?? currentSnapshot?.statusText),
      dateText: preferSnapshotText(baseDaySnapshot.dateText, hourlySnapshot.dateText ?? currentSnapshot?.dateText),
      locationLabel: preferSnapshotText(baseDaySnapshot.locationLabel, hourlySnapshot.locationLabel ?? currentLocationLabel),
      liveClock: false,
    };
  }

  function getRepresentativeHourlyIndex(hourlyForecast, dayIndex, timezoneOffset) {
    if (!Array.isArray(hourlyForecast) || !hourlyForecast.length) {
      return 0;
    }

    if (dayIndex === 0) {
      const nowIndex = hourlyForecast.findIndex((entry) => entry.label === "Now");
      return nowIndex === -1 ? 0 : nowIndex;
    }

    const preferredHour = 12;
    const withHours = hourlyForecast
      .map((entry, index) => ({
        index,
        hour: typeof entry.timestamp === "number"
          ? getShiftedDate(entry.timestamp, timezoneOffset || 0).getUTCHours()
          : preferredHour,
      }));

    return withHours.reduce((best, current) => {
      const bestDistance = Math.abs(best.hour - preferredHour);
      const currentDistance = Math.abs(current.hour - preferredHour);
      return currentDistance < bestDistance ? current : best;
    }).index;
  }

  function resolveSelectedDayUvIndex(hourlyUvIndexText, dayUvIndexText, theme, dayIndex, representativeHour) {
    const liveUv = preferSnapshotText(hourlyUvIndexText, "");
    if (liveUv) {
      return liveUv;
    }

    return preferSnapshotText(dayUvIndexText, null);
  }

  function classifyCondition(weatherEntries) {
    return classifyWeather({
      weather: weatherEntries,
      timezone: 0,
      sys: { sunset: Number.MAX_SAFE_INTEGER },
    }).replace("night", "clear");
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

  function formatPercentValue(value) {
    return value === null || value === undefined ? "--" : `${Math.round(value)}%`;
  }

  function formatUvIndex(value) {
    return typeof value === "number" ? String(Math.round(value)) : null;
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

  function getHourlySlotKey(unixSeconds) {
    return Math.floor(unixSeconds / 3600);
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
      if (isNight) return "night";
      if (description.includes("few"))       return "few-clouds";
      if (description.includes("scattered")) return "scattered-clouds";
      if (description.includes("broken"))    return "broken-clouds";
      if (description.includes("overcast"))  return "overcast";
      return "clouds";
    }

    return isNight ? "night" : "clear";
  }

  function isNightTime(weatherData) {
    if (!weatherData.sys) {
      return false;
    }

    const currentUtc = Math.floor(Date.now() / 1000);
    const sunrise = weatherData.sys.sunrise;
    const sunset  = weatherData.sys.sunset;

    // Use real sunrise/sunset when available (OpenWeatherMap provides these)
    if (typeof sunrise === "number" && typeof sunset === "number") {
      return currentUtc < sunrise || currentUtc > sunset;
    }

    // Fallback: estimate from local hour when sys data is incomplete
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

  function showError(message, title = "Could not load weather data.") {
    errorTitle.textContent = title;
    errorText.textContent = message;
    stateLayer.hidden = false;
    errorMessage.hidden = false;
  }

  function hideError() {
    errorMessage.hidden = true;
    stateLayer.hidden = true;
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

});
