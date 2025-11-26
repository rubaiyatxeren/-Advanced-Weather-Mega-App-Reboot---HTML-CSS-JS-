// Configuration
const CONFIG = {
  API_KEY: "YOUR_API_KEY",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
};

// App State
const state = {
  unit: "metric",
  currentCity: "",
  isDarkMode: false,
  hourlyChart: null,
};

// DOM Elements
const $ = (id) => document.getElementById(id);
const elements = {
  cityInput: $("cityInput"),
  searchBtn: $("searchBtn"),
  locationBtn: $("locationBtn"),
  currentWeather: $("currentWeather"),
  forecast: $("forecastWeather"),
  favorites: $("favorites"),
  addFavorite: $("addFavoriteBtn"),
  themeToggle: $("themeToggle"),
  unitsToggle: $("unitsToggle"),
  airQuality: $("airQuality"),
};

// Initialize App
function init() {
  setupEventListeners();
  loadFavorites();
  getWeather("London");
}

// Event Listeners
function setupEventListeners() {
  elements.searchBtn.addEventListener("click", handleSearch);
  elements.locationBtn.addEventListener("click", getWeatherByLocation);
  elements.addFavorite.addEventListener("click", addCurrentToFavorites);
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.unitsToggle.addEventListener("click", toggleUnits);

  elements.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

// Search Handler
function handleSearch() {
  const city = elements.cityInput.value.trim();
  if (city) getWeather(city);
}

// API Functions
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Data not available");
  return await response.json();
}

async function getWeather(city) {
  try {
    state.currentCity = city;
    const weatherData = await fetchData(
      `${CONFIG.BASE_URL}/weather?q=${city}&appid=${CONFIG.API_KEY}&units=${state.unit}`
    );

    displayCurrentWeather(weatherData);
    getForecast(weatherData.coord.lat, weatherData.coord.lon);
    getAirQuality(weatherData.coord.lat, weatherData.coord.lon);
    saveToRecent(city);
  } catch (error) {
    showError(elements.currentWeather, "City not found");
  }
}

async function getForecast(lat, lon) {
  try {
    const forecastData = await fetchData(
      `${CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${state.unit}`
    );

    displayForecast(forecastData);
    displayHourlyForecast(forecastData);
  } catch (error) {
    showError(elements.forecast, "Forecast unavailable");
  }
}

async function getAirQuality(lat, lon) {
  try {
    const airQualityData = await fetchData(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`
    );

    displayAirQuality(airQualityData);
  } catch (error) {
    showError(elements.airQuality, "Air quality data unavailable");
  }
}

// Display Functions
function displayCurrentWeather(data) {
  const { name, main, weather, wind, sys, visibility } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const unitSymbol = state.unit === "metric" ? "°C" : "°F";
  const windUnit = state.unit === "metric" ? "m/s" : "mph";
  const isFavorite = getFavorites().includes(name);

  elements.currentWeather.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="text-center md:text-left mb-4 md:mb-0">
        <div class="flex items-center justify-center md:justify-start">
          <h2 class="text-2xl font-bold mr-2">${name}, ${sys.country}</h2>
          <button id="favorite-star" class="text-yellow-400 text-xl">
            <i class="${isFavorite ? "fas" : "far"} fa-star"></i>
          </button>
        </div>
        <div class="text-5xl font-bold my-2">${Math.round(
          main.temp
        )}${unitSymbol}</div>
        <div class="text-gray-600 capitalize text-lg">${
          weather[0].description
        }</div>
        <div class="text-gray-500 mt-1">
          H: ${Math.round(main.temp_max)}${unitSymbol} L: ${Math.round(
    main.temp_min
  )}${unitSymbol}
        </div>
      </div>
      <img src="${iconUrl}" alt="${
    weather[0].description
  }" class="w-24 h-24 animate-pulse hover:animate-bounce transition-all duration-300">
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      ${createWeatherCard(
        "Feels Like",
        `${Math.round(main.feels_like)}${unitSymbol}`
      )}
      ${createWeatherCard("Humidity", `${main.humidity}%`)}
      ${createWeatherCard("Wind", `${wind.speed} ${windUnit}`)}
      ${createWeatherCard("Visibility", `${(visibility / 1000).toFixed(1)} km`)}
    </div>
  `;

  // Add favorite star functionality
  document.getElementById("favorite-star").addEventListener("click", () => {
    toggleFavorite(name);
  });
}

function createWeatherCard(label, value) {
  return `
    <div class="bg-blue-50 p-3 rounded-lg text-center">
      <div class="text-gray-500">${label}</div>
      <div class="font-semibold">${value}</div>
    </div>
  `;
}

function displayForecast(data) {
  const dailyForecasts = data.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  const unitSymbol = state.unit === "metric" ? "°C" : "°F";

  elements.forecast.innerHTML = dailyForecasts
    .map((day) => {
      const date = new Date(day.dt * 1000);
      const dayName = date.toLocaleDateString("en", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      });
      const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

      return `
      <div class="bg-blue-50 rounded-lg p-3 text-center">
        <div class="font-semibold">${dayName}</div>
        <div class="text-gray-500 text-sm">${dateStr}</div>
        <img src="${iconUrl}" alt="${
        day.weather[0].description
      }" class="mx-auto my-2">
        <div class="text-lg font-bold">${Math.round(
          day.main.temp
        )}${unitSymbol}</div>
        <div class="text-gray-600 text-sm capitalize">${
          day.weather[0].description
        }</div>
        <div class="flex justify-between text-xs mt-2">
          <div>H: ${Math.round(day.main.temp_max)}${unitSymbol}</div>
          <div>L: ${Math.round(day.main.temp_min)}${unitSymbol}</div>
        </div>
      </div>
    `;
    })
    .join("");
}

function displayHourlyForecast(data) {
  const hourlyData = data.list.slice(0, 8);
  const labels = hourlyData.map((item) =>
    new Date(item.dt * 1000).toLocaleTimeString("en", {
      hour: "numeric",
      hour12: true,
    })
  );

  const temperatures = hourlyData.map((item) => Math.round(item.main.temp));
  const unitSymbol = state.unit === "metric" ? "°C" : "°F";
  const ctx = document.getElementById("hourlyChart").getContext("2d");

  // Clear previous chart
  if (state.hourlyChart) state.hourlyChart.destroy();

  state.hourlyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Temperature (${unitSymbol})`,
          data: temperatures,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false } },
    },
  });
}

function displayAirQuality(data) {
  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;

  const aqiLevels = [
    {
      level: "Good",
      color: "bg-green-500",
      desc: "Air quality is satisfactory",
    },
    {
      level: "Fair",
      color: "bg-yellow-500",
      desc: "Air quality is acceptable",
    },
    {
      level: "Moderate",
      color: "bg-orange-500",
      desc: "Sensitive groups may experience health effects",
    },
    {
      level: "Poor",
      color: "bg-red-500",
      desc: "Health effects possible for everyone",
    },
    {
      level: "Very Poor",
      color: "bg-purple-500",
      desc: "Health warning of emergency conditions",
    },
  ];

  const level = aqiLevels[aqi - 1];

  elements.airQuality.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div class="text-lg font-semibold">Air Quality Index</div>
      <div class="px-3 py-1 rounded-full text-white ${level.color}">${
    level.level
  }</div>
    </div>
    <div class="text-gray-600 mb-4">${level.desc}</div>
    <div class="grid grid-cols-2 gap-4">
      ${createAirQualityItem("PM2.5", `${components.pm2_5} μg/m³`)}
      ${createAirQualityItem("PM10", `${components.pm10} μg/m³`)}
      ${createAirQualityItem("NO₂", `${components.no2} μg/m³`)}
      ${createAirQualityItem("O₃", `${components.o3} μg/m³`)}
    </div>
  `;
}

function createAirQualityItem(label, value) {
  return `
    <div class="text-center">
      <div class="text-gray-500 text-sm">${label}</div>
      <div class="font-semibold">${value}</div>
    </div>
  `;
}

// Location Services
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError(elements.currentWeather, "Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const locationData = await fetchData(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${CONFIG.API_KEY}`
        );

        if (locationData.length > 0) {
          getWeather(locationData[0].name);
        }
      } catch (error) {
        showError(elements.currentWeather, "Location data unavailable");
      }
    },
    () => showError(elements.currentWeather, "Location access denied")
  );
}

// Favorites Management
function getFavorites() {
  return JSON.parse(localStorage.getItem("weatherFavorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
}

function loadFavorites() {
  const favorites = getFavorites();
  elements.favorites.innerHTML = "";

  favorites.forEach((city) => {
    const favoriteElement = document.createElement("div");
    favoriteElement.className =
      "bg-blue-100 text-blue-800 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-200 transition-colors";
    favoriteElement.textContent = city;
    favoriteElement.addEventListener("click", () => getWeather(city));
    elements.favorites.appendChild(favoriteElement);
  });
}

function addCurrentToFavorites() {
  if (!state.currentCity) return;

  const favorites = getFavorites();
  if (!favorites.includes(state.currentCity)) {
    favorites.push(state.currentCity);
    saveFavorites(favorites);
    loadFavorites();
  }
}

function toggleFavorite(city) {
  const favorites = getFavorites();
  const favoriteIndex = favorites.indexOf(city);

  if (favoriteIndex > -1) {
    favorites.splice(favoriteIndex, 1);
  } else {
    favorites.push(city);
  }

  saveFavorites(favorites);
  loadFavorites();

  // Update star icon
  const favoriteStar = document.getElementById("favorite-star");
  favoriteStar.innerHTML =
    favoriteIndex > -1
      ? '<i class="far fa-star"></i>'
      : '<i class="fas fa-star"></i>';
}

// Utility Functions
function showError(element, message) {
  element.innerHTML = `<div class="text-red-500 text-center">${message}</div>`;
}

function saveToRecent(city) {
  let recent = JSON.parse(localStorage.getItem("weatherRecent")) || [];
  recent = recent.filter((item) => item !== city);
  recent.unshift(city);
  recent = recent.slice(0, 5);
  localStorage.setItem("weatherRecent", JSON.stringify(recent));
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  document.body.classList.toggle("dark");
  elements.themeToggle.innerHTML = state.isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

function toggleUnits() {
  state.unit = state.unit === "metric" ? "imperial" : "metric";
  elements.unitsToggle.textContent =
    state.unit === "metric" ? "°C / °F" : "°F / °C";

  if (state.currentCity) {
    getWeather(state.currentCity);
  }
}

// Start the App
init();
