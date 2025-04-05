"use client"

import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

interface ThemeOption {
  name: string
  value: string
  primary: string
}

interface SettingsModalProps {
  show: boolean
  onClose: () => void
  settings: {
    colorTheme: string
    enableParticles: boolean
    particleDensity: number
    autoChangeJoke: boolean
    autoChangeInterval: number
  }
  onSettingsChange: {
    setColorTheme: (value: string) => void
    setEnableParticles: (value: boolean) => void
    setParticleDensity: (value: number) => void
    setAutoChangeJoke: (value: boolean) => void
    setAutoChangeInterval: (value: number) => void
  }
  themeOptions: ThemeOption[]
  themeColors: string
}

export function SettingsModal({
  show,
  onClose,
  settings,
  onSettingsChange,
  themeOptions,
  themeColors,
}: SettingsModalProps) {
  if (!show) return null

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved.",
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-md font-medium text-slate-700 dark:text-slate-300">Appearance</h3>
            <div className="grid gap-2">
              <Label htmlFor="colorTheme">Color Theme</Label>
              <Select value={settings.colorTheme} onValueChange={onSettingsChange.setColorTheme}>
                <SelectTrigger id="colorTheme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-2">
              <Label htmlFor="enableParticles" className="cursor-pointer">
                Background Effects
              </Label>
              <Switch
                id="enableParticles"
                checked={settings.enableParticles}
                onCheckedChange={onSettingsChange.setEnableParticles}
              />
            </div>

            {settings.enableParticles && (
              <div className="grid gap-2 mt-2">
                <div className="flex justify-between">
                  <Label htmlFor="particleDensity">Particle Density</Label>
                  <span className="text-sm text-slate-500">{settings.particleDensity}</span>
                </div>
                <Slider
                  id="particleDensity"
                  min={10}
                  max={100}
                  step={5}
                  value={[settings.particleDensity]}
                  onValueChange={(value) => onSettingsChange.setParticleDensity(value[0])}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-md font-medium text-slate-700 dark:text-slate-300">Content</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoChangeJoke" className="cursor-pointer">
                Auto-change jokes
              </Label>
              <Switch
                id="autoChangeJoke"
                checked={settings.autoChangeJoke}
                onCheckedChange={onSettingsChange.setAutoChangeJoke}
              />
            </div>

            {settings.autoChangeJoke && (
              <div className="grid gap-2 mt-2">
                <div className="flex justify-between">
                  <Label htmlFor="autoChangeInterval">Change interval (seconds)</Label>
                  <span className="text-sm text-slate-500">{settings.autoChangeInterval}s</span>
                </div>
                <Slider
                  id="autoChangeInterval"
                  min={10}
                  max={300}
                  step={10}
                  value={[settings.autoChangeInterval]}
                  onValueChange={(value) => onSettingsChange.setAutoChangeInterval(value[0])}
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={saveSettings} className={`bg-gradient-to-r ${themeColors} text-white`}>
              <Save size={16} className="mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

