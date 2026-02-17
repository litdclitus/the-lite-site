import { useEffect } from 'react'

export function useMobileOptimization(isDocked: boolean) {
  // Body Scroll Lock: Prevent scroll when panel is open (mobile only)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    if (!isMobile) return

    if (isDocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isDocked])

  return {}
}
