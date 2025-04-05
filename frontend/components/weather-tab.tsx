"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { WeatherWidget } from "@/components/weather-widget"

interface WeatherTabProps {
  themeColors: string
  onWeatherChange: (condition: string) => void
}

export function WeatherTab({ themeColors, onWeatherChange }: WeatherTabProps) {
  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 shadow-lg bg-white dark:bg-slate-800 border-0 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${themeColors}`}></div>
          <WeatherWidget onWeatherChange={onWeatherChange} />
        </Card>
      </motion.div>
    </div>
  )
}

