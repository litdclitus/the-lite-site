import { useEffect } from 'react'

export function useAutoFocus(
  isDocked: boolean,
  textareaRef: React.RefObject<HTMLTextAreaElement>
) {
  useEffect(() => {
    if (isDocked && typeof window !== 'undefined' && window.innerWidth > 768) {
      let attempts = 0
      const maxAttempts = 8
      const intervalId = setInterval(() => {
        attempts++

        if (textareaRef.current && !textareaRef.current.disabled) {
          textareaRef.current.focus()
          clearInterval(intervalId)
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId)
        }
      }, 50)

      return () => clearInterval(intervalId)
    }
  }, [isDocked, textareaRef])
}
