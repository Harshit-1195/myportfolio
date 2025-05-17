"use client"

import { useState } from "react"
import { Clock, AirplayIcon as Spotify, Apple, Mic, Search, Rss, Radio, Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import { motion } from "framer-motion"
import PageParticles from "@/components/page-particles"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export default function PodcastPage() {
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Spotify embed URLs - The Digital Marketing Podcast
  const spotifyShowUrl = "https://open.spotify.com/embed/show/4wv672O1RlbOtsGjtKtUYq?utm_source=generator" // The Digital Marketing Podcast
  const spotifyPlaylistUrl = "https://open.spotify.com/embed/playlist/37i9dQZF1DX5KARSfd7WcM?utm_source=generator" // Marketing Playlist

  // Featured episodes with Spotify embed URLs - Real episodes from The Digital Marketing Podcast
  const featuredEpisodes = [
    {
      id: 1,
      title: "Guide to AI Agents",
      description:
        "In this episode of The Digital Marketing Podcast, Ciaran and Daniel explore the next evolutionary leap in artificial intelligence - Agents. As AI tools like ChatGPT and Gemini become more capable, we can go beyond content generation to AI that can perform complex tasks.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/episode/5Yz2qgmL1xmIHGT4KZ1C62?utm_source=generator", // Guide to AI Agents episode
      spotifyUrl: "https://open.spotify.com/episode/5Yz2qgmL1xmIHGT4KZ1C62",
      duration: "26 min 29 sec",
      date: "Sunday",
      guest: "Ciaran and Daniel, Target Internet",
    },
    {
      id: 2,
      title: "Influencers Vs. Advocates - Building Brand Advocacy",
      description:
        "In this episode of the Digital Marketing Podcast, hosts Ciaran Rogers, Louise Crossley, and Daniel Rowles dive headfirst into a topic that's reshaping the way brands grow online: creating brand advocates vs. hiring influencers.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/episode/3Ik0mnSXUUiCJnUuQzPc3M?utm_source=generator", // Influencers Vs. Advocates episode
      spotifyUrl: "https://open.spotify.com/episode/3Ik0mnSXUUiCJnUuQzPc3M",
      duration: "36 min 34 sec",
      date: "May 7",
      guest: "Ciaran Rogers, Louise Crossley, and Daniel Rowles",
    },
    {
      id: 3,
      title: "News Years Resolutions for Marketers 2025",
      description:
        "Discover the key marketing trends and resolutions that will shape the digital landscape in the coming year.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/episode/5AvwZVawACFxNQAHgrwLvY?utm_source=generator", // News Years Resolutions episode
      spotifyUrl: "https://open.spotify.com/episode/5AvwZVawACFxNQAHgrwLvY",
      duration: "26 min 56 sec",
      date: "January 1, 2024",
      guest: "Target Internet Team",
    },
  ]

  // Regular episodes - More episodes from The Digital Marketing Podcast
  const episodes = [
    ...featuredEpisodes,
    {
      id: 4,
      title: "Digital Marketing Trends for 2024",
      description: "Explore the most important digital marketing trends that will shape the industry in 2024.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/episode/4Ug5bGjCd1nLUGVSgLNJ82?utm_source=generator", // Digital Marketing Trends episode
      spotifyUrl: "https://open.spotify.com/episode/4Ug5bGjCd1nLUGVSgLNJ82",
      duration: "30:55",
      date: "December 15, 2023",
      guest: "Daniel Rowles, Target Internet",
    },
    {
      id: 5,
      title: "Social Media Strategy Masterclass",
      description: "Learn how to create effective social media strategies that drive engagement and conversions.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/episode/6QcEm5U1nHQGhbKuBGsSft?utm_source=generator", // Social Media Strategy episode
      spotifyUrl: "https://open.spotify.com/episode/6QcEm5U1nHQGhbKuBGsSft",
      duration: "28:40",
      date: "November 28, 2023",
      guest: "Ciaran Rogers, Target Internet",
    },
  ]

  // Digital Marketing Podcasts - All real podcasts
  const digitalMarketingPodcasts = [
    {
      id: 1,
      title: "The Digital Marketing Podcast",
      host: "Target Internet",
      description: "Weekly digital marketing podcast with listeners in over 180 countries worldwide.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/4wv672O1RlbOtsGjtKtUYq?utm_source=generator", // The Digital Marketing Podcast
      spotifyUrl: "https://open.spotify.com/show/4wv672O1RlbOtsGjtKtUYq",
      category: "Digital Marketing",
    },
    {
      id: 2,
      title: "Marketing School",
      host: "Neil Patel & Eric Siu",
      description: "Daily insights on marketing, business and life from Neil Patel and Eric Siu.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/1VXcH8QHkjRcTCEd88U3ti?utm_source=generator", // Marketing School
      spotifyUrl: "https://open.spotify.com/show/1VXcH8QHkjRcTCEd88U3ti",
      category: "Digital Marketing",
    },
    {
      id: 3,
      title: "Social Media Marketing Podcast",
      host: "Michael Stelzner",
      description: "Social Media Examiner's Michael Stelzner helps your business navigate the social jungle.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/2LbVBOJ1V0ZY7HIKmQRKnU?utm_source=generator", // Social Media Marketing Podcast
      spotifyUrl: "https://open.spotify.com/show/2LbVBOJ1V0ZY7HIKmQRKnU",
      category: "Social Media",
    },
    {
      id: 4,
      title: "Online Marketing Made Easy",
      host: "Amy Porterfield",
      description:
        "Expert interviews, mini execution plans, and actionable strategies to help you grow your online business.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/5iKE5wGwqLEHrV7RdPQEJo?utm_source=generator", // Online Marketing Made Easy
      spotifyUrl: "https://open.spotify.com/show/5iKE5wGwqLEHrV7RdPQEJo",
      category: "Social Media",
    },
  ]

  // AI Podcasts - All real podcasts
  const aiPodcasts = [
    {
      id: 1,
      title: "The AI Podcast",
      host: "NVIDIA",
      description: "NVIDIA's AI Podcast explores how artificial intelligence is transforming industries and our lives.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/4TJAcN5nCbCCjEcZkZUBVK?utm_source=generator", // The AI Podcast
      spotifyUrl: "https://open.spotify.com/show/4TJAcN5nCbCCjEcZkZUBVK",
      category: "AI Technology",
    },
    {
      id: 2,
      title: "The Marketing AI Show",
      host: "Paul Roetzer",
      description: "Exploring the intersection of artificial intelligence and marketing.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/5KDMkQpzSzEVzKAD1GRjgP?utm_source=generator", // The Marketing AI Show
      spotifyUrl: "https://open.spotify.com/show/5KDMkQpzSzEVzKAD1GRjgP",
      category: "AI Marketing",
    },
    {
      id: 3,
      title: "AI for Marketers",
      host: "Christopher Penn",
      description: "How AI is impacting marketing today and what the future holds for marketers.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/5iqpYDuGYoMZBrGrHU2VxS?utm_source=generator", // AI for Marketers
      spotifyUrl: "https://open.spotify.com/show/5iqpYDuGYoMZBrGrHU2VxS",
      category: "Business AI",
    },
    {
      id: 4,
      title: "The Data Skeptic",
      host: "Kyle Polich",
      description: "Data science, statistics, machine learning, and artificial intelligence in a digestible format.",
      spotifyEmbedUrl: "https://open.spotify.com/embed/show/1BZN7H3ikovSejhwQTzNm4?utm_source=generator", // The Data Skeptic
      spotifyUrl: "https://open.spotify.com/show/1BZN7H3ikovSejhwQTzNm4",
      category: "Data Science",
    },
  ]

  const handlePlayPause = (episodeId: number) => {
    if (activeEpisode === episodeId) {
      setIsPlaying(!isPlaying)
    } else {
      setActiveEpisode(episodeId)
      setIsPlaying(true)
    }
  }

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl bg-black min-h-screen podcast-page">
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Digital Marketing Insights</h1>
          <p className="text-white/70 max-w-2xl mb-6">
            A podcast by Harshit Dabhi exploring the world of digital marketing, programmatic advertising, and media
            buying.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2"
              onClick={() => window.open("https://open.spotify.com/show/4wv672O1RlbOtsGjtKtUYq", "_blank")}
            >
              <Spotify className="h-4 w-4" /> Listen on Spotify
            </Button>
            <Button
              variant="outline"
              className="glass-panel text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
              onClick={() =>
                window.open(
                  "https://podcasts.apple.com/gb/podcast/the-digital-marketing-podcast/id1262894809",
                  "_blank",
                )
              }
            >
              <Apple className="h-4 w-4" /> Apple Podcasts
            </Button>
            <Button
              variant="outline"
              className="glass-panel text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
              onClick={() =>
                window.open("mailto:dabhiharshit11@gmail.com?subject=Podcast%20Guest%20Suggestion", "_blank")
              }
            >
              <Mic className="h-4 w-4" /> Suggest a Guest
            </Button>
          </div>
        </div>

        <ScrollRevealWrapper>
          <Tabs defaultValue="episodes" className="mb-12">
            <TabsList className="glass-panel mb-8 p-1">
              <TabsTrigger value="episodes">My Episodes</TabsTrigger>
              <TabsTrigger value="spotify-show">My Show</TabsTrigger>
              <TabsTrigger value="digital-marketing">Digital Marketing</TabsTrigger>
              <TabsTrigger value="ai-podcasts">AI Podcasts</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>

            <TabsContent value="episodes" className="space-y-8">
              {/* Featured Episode */}
              <div className="glass-panel p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-white">Featured Episode</h2>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/2">
                    {/* Direct Play Button for Featured Episode */}
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/40 flex items-center justify-center group">
                      <Button
                        className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2 z-10 transform transition-transform group-hover:scale-110"
                        onClick={() => window.open(featuredEpisodes[0].spotifyUrl, "_blank")}
                      >
                        <Play className="h-5 w-5" fill="white" /> Play Episode
                      </Button>
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                      <div className="absolute bottom-4 right-4 z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-panel text-white border-white/20 hover:bg-white/10"
                          onClick={() => window.open(featuredEpisodes[0].spotifyUrl, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> Open in Spotify
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2">
                    <h3 className="text-xl font-bold mb-2 text-white">{featuredEpisodes[0].title}</h3>
                    <div className="flex items-center text-sm text-white/50 mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{featuredEpisodes[0].duration}</span>
                      <span className="mx-2">•</span>
                      <span>{featuredEpisodes[0].date}</span>
                    </div>
                    <p className="text-white/70 mb-4">{featuredEpisodes[0].description}</p>
                    <p className="text-white/90 mb-4 font-medium">Guest: {featuredEpisodes[0].guest}</p>
                    <Button
                      className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2"
                      onClick={() => window.open(featuredEpisodes[0].spotifyUrl, "_blank")}
                    >
                      <Spotify className="h-4 w-4" /> Listen on Spotify
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recent Episodes */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Recent Episodes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredEpisodes.slice(1, 3).map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      className="glass-panel p-5 rounded-lg hover-glow relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Direct Play Button for Recent Episodes */}
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/40 flex items-center justify-center group mb-4">
                        <Button
                          className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2 z-10 transform transition-transform group-hover:scale-110"
                          onClick={() => window.open(episode.spotifyUrl, "_blank")}
                        >
                          <Play className="h-5 w-5" fill="white" /> Play Episode
                        </Button>
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                        <div className="absolute bottom-4 right-4 z-10">
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-panel text-white border-white/20 hover:bg-white/10"
                            onClick={() => window.open(episode.spotifyUrl, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" /> Open in Spotify
                          </Button>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-white">{episode.title}</h3>
                      <div className="flex items-center text-sm text-white/50 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{episode.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{episode.date}</span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">Guest: {episode.guest}</p>
                      <p className="text-sm text-white/70 line-clamp-2 mb-3">{episode.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* All Episodes */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">All Episodes</h2>
                <div className="space-y-4">
                  {episodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      className="glass-panel p-6 rounded-lg hover-glow relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          {/* Direct Play Button for All Episodes */}
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/40 flex items-center justify-center group">
                            <Button
                              className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2 z-10 transform transition-transform group-hover:scale-110"
                              onClick={() => window.open(episode.spotifyUrl, "_blank")}
                            >
                              <Play className="h-5 w-5" fill="white" /> Play Episode
                            </Button>
                            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                            <div className="absolute bottom-4 right-4 z-10">
                              <Button
                                variant="outline"
                                size="sm"
                                className="glass-panel text-white border-white/20 hover:bg-white/10"
                                onClick={() => window.open(episode.spotifyUrl, "_blank")}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" /> Open in Spotify
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <h3 className="text-xl font-bold mb-1 text-white">{episode.title}</h3>
                          <div className="flex items-center text-sm text-white/50 mb-2">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{episode.duration}</span>
                            <span className="mx-2">•</span>
                            <span>{episode.date}</span>
                          </div>
                          <p className="text-white/70 mb-3">{episode.description}</p>
                          <p className="text-white/90 mb-4 font-medium">Guest: {episode.guest}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="spotify-show">
              <div className="glass-panel p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-white">The Digital Marketing Podcast</h2>
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-lg overflow-hidden">
                  <iframe
                    src={spotifyShowUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="absolute inset-0"
                  ></iframe>
                </div>
                <div className="mt-6 text-white/70">
                  <p className="mb-4">
                    An advert free, weekly digital marketing podcast with listeners in over 180 countries worldwide.
                    Listen in for interviews with global experts, together with the latest news, tools, strategies and
                    techniques to give your digital marketing the edge.
                  </p>
                  <p>
                    Hosted by Ciaran Rogers and Daniel Rowles, the Digital Marketing Podcast has been running since 2010
                    and is one of the most popular marketing podcasts available.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="digital-marketing" className="space-y-8">
              <div className="glass-panel p-6 rounded-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Top Digital Marketing Podcasts</h2>
                  <div className="relative w-64">
                    <Input
                      type="text"
                      placeholder="Search podcasts..."
                      className="glass-panel text-white border-white/20 pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>
                <p className="text-white/70 mb-6">
                  Discover the best digital marketing podcasts to stay updated with the latest trends, strategies, and
                  insights from industry experts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {digitalMarketingPodcasts
                    .filter(
                      (podcast) =>
                        podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        podcast.host.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((podcast, index) => (
                      <motion.div
                        key={podcast.id}
                        className="glass-panel p-5 rounded-lg hover-glow relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-8 w-8 rounded-full flex items-center justify-center">
                            <Rss className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{podcast.title}</h3>
                            <p className="text-sm text-white/50">Hosted by {podcast.host}</p>
                          </div>
                        </div>
                        <p className="text-white/70 mb-4 text-sm">{podcast.description}</p>

                        {/* Direct Play Button */}
                        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-pink-900/40 flex items-center justify-center group">
                          <Button
                            className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2 z-10 transform transition-transform group-hover:scale-110"
                            onClick={() => window.open(podcast.spotifyUrl, "_blank")}
                          >
                            <Play className="h-5 w-5" fill="white" /> Play Podcast
                          </Button>
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                          <div className="absolute bottom-4 right-4 z-10">
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-panel text-white border-white/20 hover:bg-white/10"
                              onClick={() => window.open(podcast.spotifyUrl, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" /> Open in Spotify
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-podcasts" className="space-y-8">
              <div className="glass-panel p-6 rounded-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">AI & Marketing Technology Podcasts</h2>
                  <div className="relative w-64">
                    <Input
                      type="text"
                      placeholder="Search AI podcasts..."
                      className="glass-panel text-white border-white/20 pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  </div>
                </div>
                <p className="text-white/70 mb-6">
                  Explore podcasts at the intersection of artificial intelligence and marketing to learn how AI is
                  transforming the digital landscape.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiPodcasts
                    .filter(
                      (podcast) =>
                        podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        podcast.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        podcast.host.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((podcast, index) => (
                      <motion.div
                        key={podcast.id}
                        className="glass-panel p-5 rounded-lg hover-glow relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-8 w-8 rounded-full flex items-center justify-center">
                            <Radio className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{podcast.title}</h3>
                            <p className="text-sm text-white/50">Hosted by {podcast.host}</p>
                          </div>
                        </div>
                        <p className="text-white/70 mb-4 text-sm">{podcast.description}</p>

                        {/* Direct Play Button */}
                        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/40 to-cyan-900/40 flex items-center justify-center group">
                          <Button
                            className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2 z-10 transform transition-transform group-hover:scale-110"
                            onClick={() => window.open(podcast.spotifyUrl, "_blank")}
                          >
                            <Play className="h-5 w-5" fill="white" /> Play Podcast
                          </Button>
                          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                          <div className="absolute bottom-4 right-4 z-10">
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-panel text-white border-white/20 hover:bg-white/10"
                              onClick={() => window.open(podcast.spotifyUrl, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" /> Open in Spotify
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="playlists">
              <div className="glass-panel p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-white">Marketing Inspiration Playlist</h2>
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-lg overflow-hidden">
                  <iframe
                    src={spotifyPlaylistUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="glass-panel p-8 rounded-lg text-center mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Subscribe to the Podcast</h2>
            <p className="text-white/70 mb-6">
              Never miss an episode! Subscribe to Digital Marketing Insights on your favorite podcast platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center gap-2"
                onClick={() => window.open("https://open.spotify.com/show/4wv672O1RlbOtsGjtKtUYq", "_blank")}
              >
                <Spotify className="h-4 w-4" /> Subscribe on Spotify
              </Button>
              <Button
                variant="outline"
                className="glass-panel text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
                onClick={() =>
                  window.open("mailto:dabhiharshit11@gmail.com?subject=Podcast%20Guest%20Suggestion", "_blank")
                }
              >
                <Mic className="h-4 w-4" /> Suggest a Guest
              </Button>
            </div>
          </div>
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
