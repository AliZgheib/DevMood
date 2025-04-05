"use client"

import { useState } from "react"
import { Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

// Curated low-tone study/work music playlists
const musicEmbeds = [
  {
    name: "Deep Focus",
    embed: `https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator`,
  },
  {
    name: "Ambient Chill",
    embed: `https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator`,
  },
  {
    name: "Peaceful Piano",
    embed: `https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator`,
  },
  {
    name: "Atmospheric Calm",
    embed: `https://open.spotify.com/embed/playlist/37i9dQZF1DWUvHZA1zLcjW?utm_source=generator`,
  },
  {
    name: "Minimal Piano",
    embed: `https://open.spotify.com/embed/playlist/37i9dQZF1DX0jgyAiPl8Af?utm_source=generator`,
  },
]

interface MusicTabProps {
  themeColors: string
}

export function MusicTab({ themeColors }: MusicTabProps) {
  const [musicIndex, setMusicIndex] = useState(0)
  const [isMusicChanging, setIsMusicChanging] = useState(false)

  const shuffleMusic = () => {
    setIsMusicChanging(true)
    setTimeout(() => {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * musicEmbeds.length)
      } while (newIndex === musicIndex && musicEmbeds.length > 1)

      setMusicIndex(newIndex)
      setIsMusicChanging(false)
    }, 300)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 mb-6 shadow-lg bg-white dark:bg-slate-800 border-0 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${themeColors}`}></div>
          <h2 className="text-lg font-medium mb-3 text-slate-700 dark:text-slate-200">
            {musicEmbeds[musicIndex].name}
          </h2>
          <AnimatePresence mode="wait">
            {!isMusicChanging && (
              <motion.div
                key={musicEmbeds[musicIndex].embed}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <iframe
                  style={{ borderRadius: "12px" }}
                  src={musicEmbeds[musicIndex].embed}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="shadow-sm"
                ></iframe>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      <div className="flex justify-center">
        <Button
          onClick={shuffleMusic}
          className={`bg-gradient-to-r ${themeColors} hover:opacity-90 text-white border-0`}
        >
          <Shuffle size={16} className="mr-2" />
          New Playlist
        </Button>
      </div>
    </div>
  )
}

