"use client"

import { useState, useEffect } from "react"

export default function WeatherCard() {
  const [location, setLocation] = useState("Loading location...")
  const [temperature, setTemperature] = useState("--°C")
  const [description, setDescription] = useState("Loading weather...")
  const [windSpeed, setWindSpeed] = useState("-- km/h")
  const [humidity, setHumidity] = useState("--%")
  const [weatherIcon, setWeatherIcon] = useState("fa-cloud")
  const [forecast, setForecast] = useState<Array<{ day: string, temp: number, icon: string }>>([])

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      // Using WeatherAPI.com
      const apiKey = '8fca2fded4f74c5780b154627250704';
      const city = 'Phagwara'; // Default city, could be made dynamic

      // Get current weather data
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`);

      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();

      // Update weather information
      setLocation(`${data.location.name}, ${data.location.country}`);
      setTemperature(`${Math.round(data.current.temp_c)}°C`);
      setDescription(data.current.condition.text);
      setWindSpeed(`${Math.round(data.current.wind_kph)} km/h`);
      setHumidity(`${data.current.humidity}%`);

      // Map WeatherAPI condition codes to Font Awesome icons
      const iconMap: { [key: number]: string } = {
        1000: "fa-sun", // Sunny/Clear
        1003: "fa-cloud-sun", // Partly cloudy
        1006: "fa-cloud", // Cloudy
        1009: "fa-cloud", // Overcast
        1030: "fa-smog", // Mist
        1063: "fa-cloud-rain", // Patchy rain
        1066: "fa-snowflake", // Patchy snow
        1069: "fa-cloud-sleet", // Patchy sleet
        1072: "fa-cloud-rain", // Patchy freezing drizzle
        1087: "fa-bolt", // Thundery outbreaks
        1114: "fa-snowflake", // Blowing snow
        1117: "fa-snowflake", // Blizzard
        1135: "fa-smog", // Fog
        1147: "fa-smog", // Freezing fog
        1150: "fa-cloud-rain", // Patchy light drizzle
        1153: "fa-cloud-rain", // Light drizzle
        1168: "fa-cloud-rain", // Freezing drizzle
        1171: "fa-cloud-rain", // Heavy freezing drizzle
        1180: "fa-cloud-rain", // Patchy light rain
        1183: "fa-cloud-rain", // Light rain
        1186: "fa-cloud-rain", // Moderate rain at times
        1189: "fa-cloud-rain", // Moderate rain
        1192: "fa-cloud-showers-heavy", // Heavy rain at times
        1195: "fa-cloud-showers-heavy", // Heavy rain
        1198: "fa-cloud-rain", // Light freezing rain
        1201: "fa-cloud-showers-heavy", // Moderate or heavy freezing rain
        1204: "fa-cloud-sleet", // Light sleet
        1207: "fa-cloud-sleet", // Moderate or heavy sleet
        1210: "fa-snowflake", // Patchy light snow
        1213: "fa-snowflake", // Light snow
        1216: "fa-snowflake", // Patchy moderate snow
        1219: "fa-snowflake", // Moderate snow
        1222: "fa-snowflake", // Patchy heavy snow
        1225: "fa-snowflake", // Heavy snow
        1237: "fa-snowflake", // Ice pellets
        1240: "fa-cloud-rain", // Light rain shower
        1243: "fa-cloud-showers-heavy", // Moderate or heavy rain shower
        1246: "fa-cloud-showers-heavy", // Torrential rain shower
        1249: "fa-cloud-sleet", // Light sleet showers
        1252: "fa-cloud-sleet", // Moderate or heavy sleet showers
        1255: "fa-snowflake", // Light snow showers
        1258: "fa-snowflake", // Moderate or heavy snow showers
        1261: "fa-snowflake", // Light showers of ice pellets
        1264: "fa-snowflake", // Moderate or heavy showers of ice pellets
        1273: "fa-bolt", // Patchy light rain with thunder
        1276: "fa-bolt", // Moderate or heavy rain with thunder
        1279: "fa-bolt", // Patchy light snow with thunder
        1282: "fa-bolt", // Moderate or heavy snow with thunder
      };

      setWeatherIcon(iconMap[data.current.condition.code] || "fa-cloud");

      // Process 5-day forecast
      const forecastData = data.forecast.forecastday.map((day: any) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        return {
          day: dayName,
          temp: Math.round(day.day.avgtemp_c),
          icon: iconMap[day.day.condition.code] || "fa-cloud"
        };
      });

      setForecast(forecastData);

    } catch (error) {
      console.error("Error fetching weather data:", error);
      setDescription("Unable to fetch weather data");

      // Set fallback forecast data if API fails
      setForecast([
        { day: "Mon", temp: 24, icon: "fa-sun" },
        { day: "Tue", temp: 22, icon: "fa-cloud-sun" },
        { day: "Wed", temp: 20, icon: "fa-cloud" },
        { day: "Thu", temp: 19, icon: "fa-cloud-rain" },
        { day: "Fri", temp: 21, icon: "fa-cloud-sun" }
      ]);
    }
  }

  return (
    <div className="mirror-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Weather</h3>
        <span className="text-gray-400">{location}</span>
      </div>
      <div className="flex flex-wrap items-center">
        <div className="text-5xl mr-4 animate-float">
          <i className={`fas ${weatherIcon}`}></i>
        </div>
        <div>
          <div className="text-4xl font-bold">{temperature}</div>
          <div className="text-gray-400">{description}</div>
        </div>
        <div className="ml-auto">
          <div className="flex items-center mb-2">
            <i className="fas fa-wind mr-2"></i>
            <span>{windSpeed}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-tint mr-2"></i>
            <span>{humidity}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-400">{day.day}</div>
              <div className="text-xl">
                <i className={`fas ${day.icon}`}></i>
              </div>
              <div className="text-sm">{day.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

