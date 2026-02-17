import { useEffect, useMemo, useState } from 'react'

type VisualViewportSnapshot = {
  height: number
  width: number
  offsetTop: number
  offsetLeft: number
  scale: number
  isSupported: boolean
}

function getSnapshot(): VisualViewportSnapshot {
  if (typeof window === 'undefined') {
    return {
      height: 0,
      width: 0,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      isSupported: false,
    }
  }

  const vv = window.visualViewport
  if (!vv) {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
      offsetTop: 0,
      offsetLeft: 0,
      scale: 1,
      isSupported: false,
    }
  }

  return {
    height: Math.round(vv.height),
    width: Math.round(vv.width),
    offsetTop: Math.round(vv.offsetTop),
    offsetLeft: Math.round(vv.offsetLeft),
    scale: vv.scale ?? 1,
    isSupported: true,
  }
}

/**
 * Tracks the *visual* viewport (keyboard-aware on mobile).
 * - On iOS/Android, `visualViewport.height` shrinks when the keyboard opens.
 * - We also track `offsetTop` for Safari edge cases.
 */
export function useVisualViewport() {
  const [snapshot, setSnapshot] = useState<VisualViewportSnapshot>(() =>
    getSnapshot(),
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setSnapshot(getSnapshot()))
    }

    update()

    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener('resize', update)
      vv.addEventListener('scroll', update)
    }
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    return () => {
      cancelAnimationFrame(raf)
      if (vv) {
        vv.removeEventListener('resize', update)
        vv.removeEventListener('scroll', update)
      }
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    // keep aligned with existing breakpoint usage (<= 768)
    return window.innerWidth <= 768
  }, [])

  return { ...snapshot, isMobile }
}

