import { useEffect } from 'react'

export function useKeyboardShortcuts(
  isDocked: boolean,
  onOpen: () => void,
  onClose: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+I to open chat panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        if (!isDocked) {
          onOpen()
        }
      }
      // ESC to close chat panel
      if (e.key === 'Escape' && isDocked) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDocked, onOpen, onClose])
}
