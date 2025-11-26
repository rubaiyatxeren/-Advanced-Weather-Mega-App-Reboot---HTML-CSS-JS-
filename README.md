# 🌤️ Advanced Weather Mega App - HTML, CSS, TAILWIND & JS

A modern, feature-rich weather application built with vanilla JavaScript that provides comprehensive weather information with an intuitive user interface.

## ✨ Features

### 🌍 Core Weather Data
- **Current Weather**: Temperature, humidity, wind speed, visibility, and "feels like" temperature
- **5-Day Forecast**: Daily weather predictions with high/low temperatures
- **24-Hour Forecast**: Interactive chart showing temperature trends
- **Air Quality Index**: Real-time air pollution data with health recommendations

### 🎯 User Experience
- **Location Services**: Automatic weather detection using geolocation
- **Favorite Cities**: Save and quickly access preferred locations
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Unit Conversion**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Advanced Features
- **Interactive Charts**: Visual hourly temperature trends using Chart.js
- **Comprehensive Metrics**: Detailed weather components and air quality data
- **Smart Search**: City search with error handling and validation
- **Local Storage**: Persists favorites and preferences

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection for API calls
- Location access permission (optional, for auto-detection)

### Installation
1. Clone or download the project files
2. Ensure all files are in the same directory:
   - `index.html`
   - `style.css` (or your CSS framework)
   - `app.js`
3. Open `index.html` in your web browser

### API Configuration
The app uses OpenWeatherMap API. The current configuration includes a demo API key. For production use:

1. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the API key in `app.js`:
```javascript
const CONFIG = {
  API_KEY: "your_actual_api_key_here",
  BASE_URL: "https://api.openweathermap.org/data/2.5",
};
```

## 🎮 How to Use

### Searching for Weather
1. **Type a city name** in the search box
2. **Press Enter** or click the search button (🔍)
3. **Use your location** by clicking the location button (📍)

### Managing Favorites
- **Add current city**: Click "Add Current" in favorites section
- **Toggle favorite**: Click the star icon (⭐) on any city
- **Quick access**: Click any city in favorites to load its weather

### Customizing Experience
- **Toggle theme**: Switch between dark/light mode using the moon/sun button
- **Change units**: Switch between °C/°F using the units toggle button


## 🔧 Technical Details

### APIs Used
- **OpenWeatherMap Current Weather API**
- **OpenWeatherMap 5-Day Forecast API**
- **OpenWeatherMap Air Pollution API**
- **Browser Geolocation API**

### Libraries & Dependencies
- **Chart.js**: For hourly forecast visualization
- **Font Awesome**: For icons and UI elements
- **Tailwind CSS**: For styling and responsive design

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🛠️ Development

### Key Functions
- `getWeather(city)`: Fetches and displays current weather data
- `getForecast(lat, lon)`: Retrieves 5-day weather forecast
- `getAirQuality(lat, lon)`: Fetches air quality information
- `toggleFavorite(city)`: Manages favorite cities
- `toggleTheme()`: Handles dark/light mode switching

### State Management
```javascript
const state = {
  unit: "metric",           // Temperature unit
  currentCity: "",          // Currently displayed city
  isDarkMode: false,        // Theme state
  hourlyChart: null         // Chart.js instance
};
```

## 🌟 Features in Detail

### Current Weather Display
- City name and country flag
- Current temperature with weather icon
- Weather description
- High/Low temperatures
- Additional metrics: Feels like, humidity, wind, visibility

### 5-Day Forecast
- Day names and dates
- Weather icons and descriptions
- Temperature ranges
- Compact card layout

### Air Quality Information
- AQI level with color coding
- Health recommendations
- Pollutant concentrations:
  - PM2.5 & PM10 particles
  - Nitrogen dioxide (NO₂)
  - Ozone (O₃)

## 🔒 Privacy & Data

- Location data is only used for weather detection
- No personal data is stored or transmitted
- Favorites are stored locally in your browser
- All API calls are made securely via HTTPS

## 🐛 Troubleshooting

### Common Issues
- **"City not found"**: Check spelling or try different city names
- **Location not working**: Ensure location permissions are granted
- **Chart not loading**: Check internet connection and JavaScript console
- **API errors**: Verify API key is valid and has required permissions

### Error Messages
- "City not found" - Invalid city name or spelling error
- "Location access denied" - Browser location permission required
- "Data not available" - API service temporarily unavailable

## 📄 License

This project is for educational purposes. The OpenWeatherMap API requires proper attribution for commercial use.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for:
- Bug fixes
- New features
- UI/UX improvements
- Performance optimizations

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your internet connection
3. Ensure all files are properly loaded
4. Check API key validity

---

**Enjoy accurate weather forecasts with this powerful yet simple weather application!** 🌈
