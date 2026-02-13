import { useState, useEffect } from 'react'

export function useMobileOptimization(isDocked: boolean) {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)

  // Visual Viewport API: Handle keyboard on mobile
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    
    const isMobile = window.innerWidth <= 768
    if (!isMobile) return

    const handleViewportResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height)
      }
    }

    if (window.visualViewport) {
      setViewportHeight(window.visualViewport.height)
    }

    window.visualViewport.addEventListener('resize', handleViewportResize)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize)
    }
  }, [])

  // Body Scroll Lock: Prevent scroll when panel is open (mobile only)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    if (!isMobile) return

    if (isDocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      document.body.style.paddingRight = ''
    }
  }, [isDocked])

  return { viewportHeight }
}
