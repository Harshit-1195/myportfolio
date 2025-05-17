"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedLogoProps {
  className?: string
}

export default function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  return (
    <div className={cn("relative font-serif", className)}>
      <div
        className={cn(
          "transition-all duration-1000 transform",
          isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <h1 className="text-xl font-signature tracking-tight">Harshit</h1>
        <h2
          className={cn(
            "text-xl font-medium tracking-tight -mt-2 transition-all duration-1000 delay-300 transform",
            isAnimated ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
          )}
        >
          DABHI
        </h2>
      </div>

      <div
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-1000 delay-600",
          isAnimated ? "w-full" : "w-0",
        )}
      />
    </div>
  )
}
