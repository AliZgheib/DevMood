"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

// Dev jokes collection
const devJokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "!false - It's funny because it's true.",
  "A programmer puts two glasses on his bedside table before going to sleep. One full of water in case he gets thirsty and one empty in case he doesn't.",
  "There are 10 types of people in this world: those who understand binary and those who don't.",
  "Why did the developer go broke? Because he used up all his cache.",
  "What's the object-oriented way to become wealthy? Inheritance.",
  "Why did the functions stop calling each other? They had too many arguments.",
  "Why was the JavaScript developer sad? Because he didn't know how to null his feelings.",
  "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.' The programmer returns with 12 loaves of bread.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.",
  "Why do programmers hate nature? It has too many bugs.",
  "What's a programmer's favorite hangout place? Foo Bar.",
  "What did the Java code say to the C code? You've got no class.",
  "Why don't programmers like to go outside? The sun causes too many reflections.",
  "What do you call a programmer from Finland? Nerdic.",
  "Why was the developer unhappy at their job? They wanted arrays.",
]

interface JokesTabProps {
  themeColors: string
  autoChange: boolean
  autoChangeInterval: number
}

export function JokesTab({ themeColors, autoChange, autoChangeInterval }: JokesTabProps) {
  const [joke, setJoke] = useState("")
  const [isJokeChanging, setIsJokeChanging] = useState(false)
  const autoChangeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize with random joke
  useEffect(() => {
    shuffleJoke()
  }, [])

  // Set up auto-change timer when settings change
  useEffect(() => {
    if (autoChangeTimerRef.current) {
      clearInterval(autoChangeTimerRef.current)
      autoChangeTimerRef.current = null
    }

    if (autoChange) {
      autoChangeTimerRef.current = setInterval(() => {
        shuffleJoke()
      }, autoChangeInterval * 1000)
    }

    return () => {
      if (autoChangeTimerRef.current) {
        clearInterval(autoChangeTimerRef.current)
      }
    }
  }, [autoChange, autoChangeInterval])

  const shuffleJoke = () => {
    setIsJokeChanging(true)
    setTimeout(() => {
      let randomIndex
      let newJoke

      do {
        randomIndex = Math.floor(Math.random() * devJokes.length)
        newJoke = devJokes[randomIndex]
      } while (newJoke === joke && devJokes.length > 1)

      setJoke(newJoke)
      setIsJokeChanging(false)
    }, 300)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6 shadow-lg bg-white dark:bg-slate-800 border-0 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${themeColors}`}></div>
          <AnimatePresence mode="wait">
            {!isJokeChanging && (
              <motion.div
                key={joke}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-lg text-slate-700 dark:text-slate-200 min-h-[120px] flex items-center justify-center text-center"
              >
                {joke}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      <div className="flex justify-center">
        <Button
          onClick={shuffleJoke}
          className={`bg-gradient-to-r ${themeColors} hover:opacity-90 text-white border-0`}
        >
          <RefreshCw size={16} className="mr-2" />
          New Joke
        </Button>
      </div>
    </div>
  )
}

