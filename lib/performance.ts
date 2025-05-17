/**
 * Performance optimization utilities
 */

// Detect if the device is low-end
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false

  // Check for device memory (available in Chrome)
  if ("deviceMemory" in navigator) {
    // @ts-ignore - deviceMemory exists but TypeScript doesn't know about it
    return navigator.deviceMemory < 4
  }

  // Check for hardware concurrency (CPU cores)
  if ("hardwareConcurrency" in navigator) {
    return navigator.hardwareConcurrency < 4
  }

  // Fallback to screen size as a rough proxy
  return window.innerWidth < 768
}

// Detect if the connection is slow
export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined") return false

  // @ts-ignore - connection exists but TypeScript doesn't know about it
  const connection =
    navigator.connection ||
    // @ts-ignore
    navigator.mozConnection ||
    // @ts-ignore
    navigator.webkitConnection

  if (connection) {
    // Check connection type
    if (
      connection.type === "cellular" ||
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g" ||
      connection.effectiveType === "3g" ||
      connection.saveData
    ) {
      return true
    }

    // Check bandwidth if available
    if (typeof connection.downlink === "number") {
      return connection.downlink < 1.5 // Less than 1.5 Mbps
    }
  }

  return false
}

// Get performance level (low, medium, high)
export function getPerformanceLevel(): "low" | "medium" | "high" {
  if (isLowEndDevice() || isSlowConnection()) {
    return "low"
  }

  if (typeof window !== "undefined" && window.innerWidth < 1200) {
    return "medium"
  }

  return "high"
}

// Reduce animation based on user preferences
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Optimize rendering frequency based on device capabilities
export function getOptimalFrameRate(): number {
  const performanceLevel = getPerformanceLevel()

  switch (performanceLevel) {
    case "low":
      return 30 // 30fps for low-end devices
    case "medium":
      return 45 // 45fps for medium devices
    case "high":
      return 60 // 60fps for high-end devices
    default:
      return 60
  }
}

// Calculate optimal throttle time based on frame rate
export function getOptimalThrottleTime(): number {
  const frameRate = getOptimalFrameRate()
  return Math.floor(1000 / frameRate) // Convert fps to ms
}
