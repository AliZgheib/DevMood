"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, MapPin, Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from "lucide-react"

interface WeatherWidgetProps {
  onWeatherChange?: (condition: string) => void
}

type WeatherData = {
  location: string
  temperature: number
  condition: string
  icon: React.ReactNode
  humidity: number
  windSpeed: number
  description: string
}

// Weather condition to icon mapping
const weatherIcons: Record<string, React.ReactNode> = {
  Clear: <Sun className="text-yellow-400" />,
  Clouds: <Cloud className="text-gray-400" />,
  Rain: <CloudRain className="text-blue-400" />,
  Drizzle: <CloudRain className="text-blue-300" />,
  Thunderstorm: <CloudLightning className="text-purple-400" />,
  Snow: <CloudSnow className="text-blue-100" />,
  Mist: <Cloud className="text-gray-300" />,
  Fog: <Cloud className="text-gray-500" />,
}

// Default locations for fallback
const defaultLocations = [
  "New York",
  "London",
  "Tokyo",
  "Sydney",
  "Paris",
  "Berlin",
  "Toronto",
  "San Francisco",
  "Singapore",
]

export function WeatherWidget({ onWeatherChange }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)

  // Check if geolocation is available on mount
  useEffect(() => {
      getRandomLocationWeather()
  }, [])

  // Update parent component when weather changes
  useEffect(() => {
    if (weather && onWeatherChange) {
      onWeatherChange(weather.condition)
    }
  }, [weather, onWeatherChange])

  const getRandomLocationWeather = () => {
    setLoading(true)

    // Get a random location from our predefined list
    const randomLocation = defaultLocations[Math.floor(Math.random() * defaultLocations.length)]

    // Use our mock data function to generate weather for this location
    setTimeout(() => {
      const mockData = getMockWeatherDataByCity(randomLocation)
      processWeatherData(mockData)
      setLoading(false)
    }, 800) // Add a small delay to make it feel like it's fetching data
  }

  const processWeatherData = (data: any) => {
    if (!data) return

    const mainCondition = data.weather[0].main
    const icon = weatherIcons[mainCondition] || <Cloud />

    setWeather({
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: mainCondition,
      description: data.weather[0].description,
      icon: icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
    })
  }

  const getMockWeatherDataByCity = (city: string) => {
    // Map of cities to mock weather data
    const cityMap: Record<string, any> = {
      "new york": {
        name: "New York",
        main: { temp: 15, humidity: 65 },
        weather: [{ main: "Clouds", description: "scattered clouds" }],
        wind: { speed: 8 },
      },
      london: {
        name: "London",
        main: { temp: 12, humidity: 80 },
        weather: [{ main: "Rain", description: "light rain" }],
        wind: { speed: 12 },
      },
      tokyo: {
        name: "Tokyo",
        main: { temp: 22, humidity: 60 },
        weather: [{ main: "Clear", description: "clear sky" }],
        wind: { speed: 5 },
      },
      sydney: {
        name: "Sydney",
        main: { temp: 25, humidity: 55 },
        weather: [{ main: "Clear", description: "clear sky" }],
        wind: { speed: 10 },
      },
      paris: {
        name: "Paris",
        main: { temp: 18, humidity: 70 },
        weather: [{ main: "Clouds", description: "broken clouds" }],
        wind: { speed: 7 },
      },
      berlin: {
        name: "Berlin",
        main: { temp: 14, humidity: 75 },
        weather: [{ main: "Drizzle", description: "light drizzle" }],
        wind: { speed: 9 },
      },
      toronto: {
        name: "Toronto",
        main: { temp: 5, humidity: 60 },
        weather: [{ main: "Snow", description: "light snow" }],
        wind: { speed: 15 },
      },
      "san francisco": {
        name: "San Francisco",
        main: { temp: 17, humidity: 72 },
        weather: [{ main: "Mist", description: "mist" }],
        wind: { speed: 11 },
      },
      singapore: {
        name: "Singapore",
        main: { temp: 30, humidity: 85 },
        weather: [{ main: "Thunderstorm", description: "thunderstorm with rain" }],
        wind: { speed: 8 },
      },
    }

    // Try to find the city in our map (case insensitive)
    const normalizedCity = city.toLowerCase()

    // Check for exact match
    if (cityMap[normalizedCity]) {
      return cityMap[normalizedCity]
    }

    // Check for partial match
    for (const key in cityMap) {
      if (key.includes(normalizedCity) || normalizedCity.includes(key)) {
        return cityMap[key]
      }
    }

    // If no match, return a random city
    const cities = Object.keys(cityMap)
    const randomCity = cities[Math.floor(Math.random() * cities.length)]
    return cityMap[randomCity]
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <RefreshCw size={24} className="animate-spin text-slate-400" />
        </div>
      ) : weather ? (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mb-2">
            <MapPin size={14} />
            <span>{weather.location}</span>
          </div>

          <div className="text-5xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
            {weather.temperature}°C
            <span className="text-4xl">{weather.icon}</span>
          </div>

          <div className="text-sm text-slate-700 dark:text-slate-300 mt-2 capitalize">{weather.description}</div>

          <div className="flex justify-between w-full mt-4 text-sm text-slate-600 dark:text-slate-400">
            <div>Humidity: {weather.humidity}%</div>
            <div>Wind: {weather.windSpeed} km/h</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-600 dark:text-slate-400 py-8">Loading weather information...</div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={getRandomLocationWeather}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
        >
          <RefreshCw size={14} className="mr-2" />
          {"New Random Location"}
        </Button>
      </div>
    </div>
  )
}

