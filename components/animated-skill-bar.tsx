"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface AnimatedSkillBarProps {
  skill: string
  percentage: number
  className?: string
  barColor?: string
}

export default function AnimatedSkillBar({
  skill,
  percentage,
  className = "",
  barColor = "bg-black",
}: AnimatedSkillBarProps) {
  const [width, setWidth] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      // Animate the width after a small delay
      const timer = setTimeout(() => {
        setWidth(percentage)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [inView, percentage])

  return (
    <div ref={ref} className={cn("mb-4", className)}>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-sm">{skill}</span>
        <span className="text-sm text-muted-foreground">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}
