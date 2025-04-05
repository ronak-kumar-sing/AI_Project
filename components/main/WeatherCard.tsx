"use client"

import { useState, useEffect } from "react"

export default function WeatherCard() {
  const [location, setLocation] = useState("Loading location...")
  const [temperature, setTemperature] = useState("--°C")
  const [description, setDescription] = useState("Loading weather...")
  const [windSpeed, setWindSpeed] = useState("-- km/h")
  const [humidity, setHumidity] = useState("--%")
  const [weatherIcon, setWeatherIcon] = useState("fa-cloud")

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      // For demo purposes, use mock data instead of API call
      // In a real app, you would use your OpenWeather API key
      // const apiKey = 'YOUR_OPENWEATHER_API_KEY';
      // const city = 'London';
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      // const data = await response.json();

      // Mock weather data
      const data = {
        name: "London",
        main: {
          temp: 22,
          humidity: 65,
        },
        weather: [
          {
            description: "partly cloudy",
            icon: "02d",
          },
        ],
        wind: {
          speed: 5.2,
        },
      }

      // Update weather information
      setLocation(data.name)
      setTemperature(`${Math.round(data.main.temp)}°C`)
      setDescription(data.weather[0].description)
      setWindSpeed(`${Math.round(data.wind.speed * 3.6)} km/h`) // Convert m/s to km/h
      setHumidity(`${data.main.humidity}%`)

      // Map OpenWeather icon codes to Font Awesome icons
      const iconMap: { [key: string]: string } = {
        "01d": "fa-sun",
        "01n": "fa-moon",
        "02d": "fa-cloud-sun",
        "02n": "fa-cloud-moon",
        "03d": "fa-cloud",
        "03n": "fa-cloud",
        "04d": "fa-cloud",
        "04n": "fa-cloud",
        "09d": "fa-cloud-showers-heavy",
        "09n": "fa-cloud-showers-heavy",
        "10d": "fa-cloud-rain",
        "10n": "fa-cloud-rain",
        "11d": "fa-bolt",
        "11n": "fa-bolt",
        "13d": "fa-snowflake",
        "13n": "fa-snowflake",
        "50d": "fa-smog",
        "50n": "fa-smog",
      }

      setWeatherIcon(iconMap[data.weather[0].icon] || "fa-cloud")
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setDescription("Unable to fetch weather data")
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
          <div className="text-center">
            <div className="text-xs text-gray-400">Mon</div>
            <div className="text-xl">
              <i className="fas fa-sun"></i>
            </div>
            <div className="text-sm">24°</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Tue</div>
            <div className="text-xl">
              <i className="fas fa-cloud-sun"></i>
            </div>
            <div className="text-sm">22°</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Wed</div>
            <div className="text-xl">
              <i className="fas fa-cloud"></i>
            </div>
            <div className="text-sm">20°</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Thu</div>
            <div className="text-xl">
              <i className="fas fa-cloud-rain"></i>
            </div>
            <div className="text-sm">19°</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Fri</div>
            <div className="text-xl">
              <i className="fas fa-cloud-sun"></i>
            </div>
            <div className="text-sm">21°</div>
          </div>
        </div>
      </div>
    </div>
  )
}

