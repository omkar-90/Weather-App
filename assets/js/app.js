const WEATHER_API_KEY = window.WEATHER_APP_CONFIG?.WEATHER_API_KEY || "";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

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

const weatherThemes = {
  clear: {
    bodyClass: "weather-clear",
    status: "Bright skies",
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
  let activeForecastDays = [];
  let currentLocationLabel = `${fallbackWeather.name}, ${fallbackWeather.sys.country}`;
  let currentHeroBaseline = null;

  initializeTheme();
  bindEvents();
  hydrateWithFallback();
  loadWeatherForCurrentLocation();

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

  function hydrateWithFallback() {
    renderWeather(fallbackWeather, fallbackForecast, true);
  }

  async function loadWeatherForCurrentLocation(showErrors = false) {
    try {
      const position = await getCurrentPosition();
      await loadWeather({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    } catch (error) {
      if (showErrors) {
        showError(error.message);
      }
    }
  }

  async function loadWeather({ city, lat, lon }) {
    try {
      let weatherData;
      let forecastData;
      let warningMessage = "";

      if (!canUseLiveApi()) {
        await simulateLoading();
        weatherData = buildDemoWeather(city);
        forecastData = fallbackForecast;
      } else {
        weatherData = await fetchWeather({ city, lat, lon });
        try {
          forecastData = await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);
        } catch (error) {
          forecastData = fallbackForecast;
          warningMessage = "Live 7-day forecast is unavailable. Showing preview forecast.";
        }
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

  function canUseLiveApi() {
    return WEATHER_API_KEY && WEATHER_API_KEY !== "YOUR_OPENWEATHERMAP_API_KEY";
  }

  async function fetchWeather({ city, lat, lon }) {
    const search = city
      ? `weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`
      : `weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;

    const response = await fetch(`${WEATHER_API_URL}/${search}`);
    if (!response.ok) {
      throw new Error(response.status === 404 ? "Location not found." : "Weather service is unavailable.");
    }

    return response.json();
  }

  async function fetchForecast(lat, lon) {
    const oneCallEndpoints = [
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`,
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`,
    ];

    for (const endpoint of oneCallEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.warn("Daily forecast endpoint failed:", error);
      }
    }

    const response = await fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Forecast service is unavailable.");
    }

    return response.json();
  }

  function renderWeather(weatherData, forecastData, isFallback = false) {
    lastWeatherSnapshot = weatherData;
    currentLocationLabel = `${weatherData.name}, ${weatherData.sys.country}`;
    const currentSnapshot = buildCurrentSnapshot(weatherData, isFallback);
    currentHeroBaseline = currentSnapshot;

    activeForecastDays = buildInteractiveForecastDays(forecastData, weatherData, currentSnapshot);
    renderHeroSnapshot(currentSnapshot);
    renderForecast(activeForecastDays, 0);
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
        renderHeroSnapshot(mergeHeroSnapshot(forecast.snapshot || buildForecastSnapshotFromFallback(forecast, index)));
        renderForecast(activeForecastDays, index);
      });
      forecastCards.appendChild(card);
    });
  }

  function buildForecastModel(forecastData, weatherData) {
    if (Array.isArray(forecastData)) {
      return ensureSevenForecastDays(
        forecastData.slice(0, 7).map((entry, index) => ({
          ...entry,
          day: index === 0 ? "Today" : entry.day,
          fullDate: entry.fullDate || getRelativeForecastDate(index, weatherData.timezone),
          snapshot: entry.snapshot || buildForecastSnapshotFromFallback(entry, index),
        })),
        weatherData
      );
    }

    if (forecastData && Array.isArray(forecastData.daily) && forecastData.daily.length) {
      return ensureSevenForecastDays(
        forecastData.daily.slice(0, 7).map((entry, index) => ({
          day: index === 0 ? "Today" : formatWeekday(entry.dt, weatherData.timezone),
          fullDate: formatForecastDate(entry.dt, weatherData.timezone),
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
        condition: pickRepresentativeCondition(group.entries),
        min: Math.min(...group.temps),
        max: Math.max(...group.temps),
        snapshot: buildListForecastSnapshot(group, weatherData, index),
      }));

    return ensureSevenForecastDays(normalized, weatherData);
  }

  function buildInteractiveForecastDays(forecastData, weatherData, currentSnapshot) {
    const days = buildForecastModel(forecastData, weatherData);
    if (days.length) {
      days[0] = {
        ...days[0],
        snapshot: currentSnapshot,
      };
    }
    return days;
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
      feelsLike: preferSnapshotValue(snapshot.feelsLike, baseline.feelsLike),
      humidity: preferSnapshotValue(snapshot.humidity, baseline.humidity),
      windSpeed: preferSnapshotValue(snapshot.windSpeed, baseline.windSpeed),
      pressure: preferSnapshotValue(snapshot.pressure, baseline.pressure),
      visibilityText: snapshot.visibilityText ?? null,
      uvIndexText: snapshot.uvIndexText ?? null,
      locationLabel: preferSnapshotText(snapshot.locationLabel, baseline.locationLabel),
      statusText: preferSnapshotText(snapshot.statusText, baseline.statusText),
      conditionText: preferSnapshotText(snapshot.conditionText, baseline.conditionText),
      dateText: preferSnapshotText(snapshot.dateText, baseline.dateText),
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
      humidity: entry.humidity ?? null,
      windSpeed: Math.round((entry.wind_speed || 0) * 3.6),
      pressure: entry.pressure ?? null,
      visibilityText: null,
      uvIndexText: typeof entry.uvi === "number" ? String(Math.round(entry.uvi)) : null,
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

  function buildForecastSnapshotFromFallback(forecast, index) {
    const dateText = forecast.fullDate || getRelativeForecastDate(index, fallbackWeather.timezone);

    return {
      temp: average([forecast.min, forecast.max]),
      conditionText: toTitleCase(forecast.condition),
      feelsLike: average([forecast.min, forecast.max]),
      humidity: null,
      windSpeed: null,
      pressure: null,
      visibilityText: null,
      uvIndexText: null,
      statusText: index === 0 ? "Preview mode" : `${forecast.day} forecast`,
      dateText,
      locationLabel: currentLocationLabel,
      theme: forecast.condition,
      liveClock: false,
    };
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
        snapshot: buildForecastSnapshotFromFallback(template, index),
      });
    }

    return normalized.slice(0, 7);
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

  function formatMetricValue(value, suffix) {
    return value === "--" || value === null || value === undefined ? "--" : `${Math.round(value)}${suffix}`;
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
      return isNight ? "night" : "clouds";
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
