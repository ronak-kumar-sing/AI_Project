"use client"

import { createContext, useContext, useState } from 'react';

interface WeatherData {
  temperature: string;
  description: string;
  windSpeed: string;
  humidity: string;
  weatherIcon: string;
  condition: string;  // For easier understanding of weather conditions
  tempNumeric: number; // For numeric comparisons
}

interface WeatherContextType {
  weatherData: WeatherData;
  updateWeatherData: (data: Partial<WeatherData>) => void;
}

const defaultWeatherData = {
  temperature: "--°C",
  description: "Loading weather...",
  windSpeed: "-- km/h",
  humidity: "--%",
  weatherIcon: "fa-cloud",
  condition: "unknown",
  tempNumeric: 0
};

const WeatherContext = createContext<WeatherContextType>({
  weatherData: defaultWeatherData,
  updateWeatherData: () => { },
});

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherData>(defaultWeatherData);

  const updateWeatherData = (data: Partial<WeatherData>) => {
    setWeatherData(prev => ({ ...prev, ...data }));
  };

  return (
    <WeatherContext.Provider value={{ weatherData, updateWeatherData }}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => useContext(WeatherContext);