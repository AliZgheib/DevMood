"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Toaster } from "@/components/ui/toaster"
import { useTheme } from "next-themes"

import { BackgroundEffect } from "@/components/background-effect"
import { JokesTab } from "@/components/jokes-tab"
import { MusicTab } from "@/components/music-tab"
import { WeatherTab } from "@/components/weather-tab"
import { SettingsModal } from "@/components/settings-modal"

// Theme options
const themeOptions = [
  { name: "Default", value: "default", primary: "from-purple-600 to-indigo-600" },
  { name: "Ocean", value: "ocean", primary: "from-blue-600 to-cyan-600" },
  { name: "Sunset", value: "sunset", primary: "from-orange-500 to-pink-600" },
  { name: "Forest", value: "forest", primary: "from-green-600 to-emerald-600" },
  { name: "Midnight", value: "midnight", primary: "from-slate-800 to-slate-900" },
]

export default function Home() {
  const { setTheme: setSystemTheme } = useTheme()
  const [theme, setTheme] = useState("light")
  const [colorTheme, setColorTheme] = useState("default")
  const [showSettings, setShowSettings] = useState(false)
  const [enableParticles, setEnableParticles] = useState(true)
  const [particleDensity, setParticleDensity] = useState(50)
  const [autoChangeJoke, setAutoChangeJoke] = useState(false)
  const [autoChangeInterval, setAutoChangeInterval] = useState(60) // seconds
  const [weatherBackground, setWeatherBackground] = useState("")

  useEffect(() => {
    // Check for saved preferences
    const loadPreferences = () => {
      const savedTheme = localStorage.getItem("devmood-theme")
      const savedColorTheme = localStorage.getItem("devmood-color-theme")
      const savedEnableParticles = localStorage.getItem("devmood-particles")
      const savedParticleDensity = localStorage.getItem("devmood-particle-density")
      const savedAutoChange = localStorage.getItem("devmood-auto-change")
      const savedAutoInterval = localStorage.getItem("devmood-auto-interval")

      if (savedTheme) {
        setTheme(savedTheme)
        setSystemTheme(savedTheme)
      }

      if (savedColorTheme) setColorTheme(savedColorTheme)
      if (savedEnableParticles) setEnableParticles(savedEnableParticles === "true")
      if (savedParticleDensity) setParticleDensity(Number.parseInt(savedParticleDensity))
      if (savedAutoChange) setAutoChangeJoke(savedAutoChange === "true")
      if (savedAutoInterval) setAutoChangeInterval(Number.parseInt(savedAutoInterval))
    }

    loadPreferences()
  }, [setSystemTheme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    setSystemTheme(newTheme)
    localStorage.setItem("devmood-theme", newTheme)
  }

  // Get current theme colors
  const getCurrentThemeColors = () => {
    const theme = themeOptions.find((t) => t.value === colorTheme) || themeOptions[0]
    return theme.primary
  }

  // Update background based on weather
  const updateWeatherBackground = (condition: string) => {
    setWeatherBackground(condition)
  }

  // Get weather-based background gradient
  const getWeatherBackground = () => {
    if (!weatherBackground) return ""

    const weatherBackgrounds = {
      Clear: "from-blue-300 to-sky-200",
      Clouds: "from-blue-200 to-gray-200",
      Rain: "from-blue-500 to-blue-300",
      Drizzle: "from-blue-400 to-blue-300",
      Thunderstorm: "from-indigo-600 to-purple-500",
      Snow: "from-blue-100 to-indigo-100",
      Mist: "from-gray-300 to-gray-200",
      Fog: "from-gray-400 to-gray-300",
    }

    return weatherBackgrounds[weatherBackground as keyof typeof weatherBackgrounds] || ""
  }

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br 
      ${
        weatherBackground && theme === "light"
          ? getWeatherBackground()
          : theme === "light"
            ? "from-blue-50 to-indigo-100"
            : "from-slate-900 to-slate-800"
      } 
      transition-colors duration-300 relative overflow-hidden`}
    >
      {enableParticles && <BackgroundEffect density={particleDensity} theme={theme} />}

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold bg-gradient-to-r ${getCurrentThemeColors()} bg-clip-text text-transparent`}
          >
            DevMood <span className="text-3xl">🎧</span>
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Fuel your coding mood</p>

          <div className="flex justify-center mt-4 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <Settings size={16} className="mr-1" />
              <span className="sr-only md:not-sr-only md:inline">Settings</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              {theme === "light" ? <Moon size={16} className="mr-1" /> : <Sun size={16} className="mr-1" />}
              <span className="sr-only md:not-sr-only md:inline">Theme</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="jokes" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="jokes">Dev Jokes</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>

          <TabsContent value="jokes">
            <JokesTab
              themeColors={getCurrentThemeColors()}
              autoChange={autoChangeJoke}
              autoChangeInterval={autoChangeInterval}
            />
          </TabsContent>

          <TabsContent value="music">
            <MusicTab themeColors={getCurrentThemeColors()} />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherTab themeColors={getCurrentThemeColors()} onWeatherChange={updateWeatherBackground} />
          </TabsContent>
        </Tabs>

        {showSettings && (
          <SettingsModal
            show={showSettings}
            onClose={() => setShowSettings(false)}
            settings={{
              colorTheme,
              enableParticles,
              particleDensity,
              autoChangeJoke,
              autoChangeInterval,
            }}
            onSettingsChange={{
              setColorTheme,
              setEnableParticles,
              setParticleDensity,
              setAutoChangeJoke,
              setAutoChangeInterval,
            }}
            themeOptions={themeOptions}
            themeColors={getCurrentThemeColors()}
          />
        )}
      </div>
      <Toaster />
    </main>
  )
}

