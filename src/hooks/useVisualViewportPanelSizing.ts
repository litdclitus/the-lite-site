import { useLayoutEffect } from 'react'

function clampHeight(h: number) {
  // avoid 0/too-small during orientation/initialization glitches
  return Math.max(Math.round(h || 0), 320)
}

/**
 * Zero-lag panel sizing on mobile keyboards.
 *
 * Instead of flowing `visualViewport.height` through React renders (which can be 1+ frames behind),
 * we imperatively set `style.height`/`style.top` on the panel element on every visualViewport change.
 * This keeps the panel perfectly in sync with the keyboard animation on iOS Safari and Android Chrome.
 */
export function useVisualViewportPanelSizing({
  enabled,
  panelRef,
}: {
  enabled: boolean
  panelRef: React.RefObject<HTMLElement | null>
}) {
  useLayoutEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    const el = panelRef.current
    if (!el) return

    const vv = window.visualViewport

    const apply = () => {
      const target = panelRef.current
      if (!target) return

      const height = clampHeight(vv ? vv.height : window.innerHeight)
      const top = Math.round(vv ? vv.offsetTop : 0)

      // Critical: no CSS transition on height/top. We control it here.
      target.style.height = `${height}px`
      target.style.top = `${top}px`

      // Keep messages pinned to bottom while keyboard is animating.
      const scrollEl = target.querySelector<HTMLElement>('[data-chat-messages-scroll]')
      if (scrollEl) {
        scrollEl.scrollTop = scrollEl.scrollHeight
      }
    }

    // Apply immediately (before first paint after focus)
    apply()

    const onVVChange = () => {
      // Apply synchronously to match keyboard sliding frames.
      apply()
    }

    vv?.addEventListener('resize', onVVChange)
    vv?.addEventListener('scroll', onVVChange)
    window.addEventListener('resize', onVVChange)
    window.addEventListener('orientationchange', onVVChange)

    return () => {
      vv?.removeEventListener('resize', onVVChange)
      vv?.removeEventListener('scroll', onVVChange)
      window.removeEventListener('resize', onVVChange)
      window.removeEventListener('orientationchange', onVVChange)

      // cleanup to avoid affecting desktop/docked closed state
      const target = panelRef.current
      if (target) {
        target.style.height = ''
        target.style.top = ''
      }
    }
  }, [enabled, panelRef])
}

