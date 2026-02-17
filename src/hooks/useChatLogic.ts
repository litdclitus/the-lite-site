import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef } from 'react'
import { extractMessageText } from '@/utils/messageUtils'

interface UseChatLogicProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onPanelOpen: () => void
}

export function useChatLogic({ textareaRef, onPanelOpen }: UseChatLogicProps) {
  const [input, setInput] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)

  const { messages, sendMessage, status, setMessages } = useChat({
    onFinish: () => {
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      // Auto-focus after bot response (desktop only)
      if (typeof window !== 'undefined' && window.innerWidth > 768) {
        let attempts = 0
        const maxAttempts = 10
        const intervalId = setInterval(() => {
          attempts++
          if (textareaRef.current && !textareaRef.current.disabled) {
            textareaRef.current.focus()
            clearInterval(intervalId)
          } else if (attempts >= maxAttempts) {
            clearInterval(intervalId)
          }
        }, 50)
      }
    },
    onError: (err) => {
      console.error('❌ Chat error:', err)
      setIsRateLimited(true)
      setTimeout(() => setIsRateLimited(false), 90000)
    },
  })

  // Auto trim messages to keep only recent 30
  useEffect(() => {
    if (messages.length > 30) {
      setMessages(messages.slice(-30))
    }
  }, [messages, setMessages])

  // Auto scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isLoading = status === 'streaming' || status === 'submitted'
  const lastMessageLengthRef = useRef(0)

  // Enhanced auto-scroll: Tracks message changes, streaming state, and content length
  useEffect(() => {
    const shouldScroll = messages.length > 0
    if (!shouldScroll) return

    // Calculate total content length to detect streaming updates
    const currentLength = messages.reduce((sum, m) => {
      const text = extractMessageText(m)
      return sum + text.length
    }, 0)

    // Scroll on: new messages, loading state changes, or streaming content updates
    const hasNewContent = currentLength > lastMessageLengthRef.current
    lastMessageLengthRef.current = currentLength

    if (hasNewContent || isLoading) {
      // "Gravity scroll" (pin to bottom). On mobile Safari, smooth scrolling while streaming can jitter.
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: isLoading ? 'auto' : 'smooth',
          block: 'end',
        })
      })
    }
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input, textareaRef])

  // Mobile: Scroll to bottom when input is focused (keyboard opens)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isMobile = window.innerWidth <= 768
    if (!isMobile || !textareaRef.current) return

    const handleFocus = () => {
      // Delay scroll to allow keyboard animation to complete
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        })
      }, 300)
    }

    const textarea = textareaRef.current
    textarea.addEventListener('focus', handleFocus)

    return () => {
      textarea?.removeEventListener('focus', handleFocus)
    }
  }, [textareaRef, messagesEndRef])

  const canSend = !!input.trim() && !isLoading && !isRateLimited

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return

    const userInput = input.trim()
    setInput('')
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    onPanelOpen() // Transition to docked mode

    try {
      await sendMessage({ text: userInput })
    } catch (err) {
      console.error('Send error:', err)
    }
  }

  return {
    input,
    setInput,
    messages,
    isLoading,
    isRateLimited,
    canSend,
    handleSubmit,
    messagesEndRef,
  }
}
