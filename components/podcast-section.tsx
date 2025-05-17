"use client"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import AnimatedText from "@/components/animated-text"

export default function PodcastSection() {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const episodes = [
    {
      id: 1,
      title: "The Future of Social Media Marketing",
      duration: "32 min",
      number: 12,
    },
    {
      id: 2,
      title: "Data-Driven Marketing Strategies",
      duration: "28 min",
      number: 11,
    },
  ]

  const handlePlayPause = (episodeId: number) => {
    if (activeEpisode === episodeId) {
      if (isPlaying) {
        audioRef.current?.pause()
      } else {
        audioRef.current?.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      setActiveEpisode(episodeId)
      setIsPlaying(true)
      // In a real implementation, you would load the audio file here
      if (audioRef.current) {
        audioRef.current.src = `/episode-${episodeId}.mp3`
        audioRef.current.play()
      }
    }
  }

  return (
    <section className="py-20 px-4 md:px-10 bg-white overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-64 h-64 mx-auto md:w-80 md:h-80 rounded-full overflow-hidden bg-pink-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="100%" stopColor="#FF8E53" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="2" />
                  {Array.from({ length: 36 }).map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1="10"
                      x2="50"
                      y2="15"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      transform={`rotate(${i * 10} 50 50)`}
                    />
                  ))}
                </svg>
                <h3 className="text-2xl font-bold text-pink-500 z-10">Podcast</h3>
              </motion.div>
            </motion.div>

            <audio ref={audioRef} className="hidden" />
          </motion.div>

          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedText
              text="Digital Marketing Insights"
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
              speed={80}
            />

            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join me on my podcast where I discuss the latest trends in digital marketing, share insights from industry
              experts, and provide actionable tips to improve your marketing strategy.
            </motion.p>

            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {episodes.map((episode) => (
                <motion.div
                  key={episode.id}
                  className="bg-gray-50 p-4 rounded-lg flex items-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full bg-black text-white hover:bg-black/80 mr-4"
                    onClick={() => handlePlayPause(episode.id)}
                  >
                    {activeEpisode === episode.id && isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <h4 className="font-medium">{episode.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Episode {episode.number} • {episode.duration}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-black text-white hover:bg-black/80 relative overflow-hidden group">
                <span className="relative z-10">Listen to All Episodes</span>
                <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0" />
                <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 ease-out delay-100 z-0" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
