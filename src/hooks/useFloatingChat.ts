import { useState, useEffect, useRef } from 'react'

export function useFloatingChat(isDocked: boolean) {
  const [hasScrolledAndStopped, setHasScrolledAndStopped] = useState(false)
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    if (isDocked) {
      setHasScrolledAndStopped(false)
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDirection = currentScrollY < lastScrollYRef.current ? 'up' : 'down'
      lastScrollYRef.current = currentScrollY

      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }

      // Expand when scrolling UP and at top (< 50px)
      if (scrollDirection === 'up' && currentScrollY < 50) {
        setHasScrolledAndStopped(true)
        collapseTimerRef.current = setTimeout(() => {
          setHasScrolledAndStopped(false)
        }, 5000)
      } else {
        setHasScrolledAndStopped(false)
      }
    }

    setHasScrolledAndStopped(false)
    lastScrollYRef.current = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
      setHasScrolledAndStopped(false)
    }
  }, [isDocked])

  return { hasScrolledAndStopped }
}
