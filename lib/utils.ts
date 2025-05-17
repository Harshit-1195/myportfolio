import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let lastFunc: NodeJS.Timeout
  let lastRan: number
  let queued = false

  return function (this: any, ...args: Parameters<T>) {
    

    if (!lastRan) {
      func.apply(this, args)
      lastRan = Date.now()
      return
    }

    clearTimeout(lastFunc)

    // If we're still within the throttle period, queue the function
    if (Date.now() - lastRan < limit) {
      if (!queued) {
        queued = true
        lastFunc = setTimeout(
          () => {
            lastRan = Date.now()
            queued = false
            func.apply(this, args)
          },
          limit - (Date.now() - lastRan),
        )
      }
      return
    }

    lastRan = Date.now()
    func.apply(this, args)
  }
}

// Add debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function (this: any, ...args: Parameters<T>) {
    

    clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

// RAF-based throttle for animations
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): (...args: Parameters<T>) => void {
  let requestId: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    

    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback.apply(this, args)
        requestId = null
      })
    }
  }
}

// Detect if the code is running on the server
export function isServer(): boolean {
  return typeof window === "undefined"
}

// Detect if the code is running in a browser
export function isBrowser(): boolean {
  return !isServer()
}
