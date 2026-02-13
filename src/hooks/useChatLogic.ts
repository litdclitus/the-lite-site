import { useChat } from '@ai-sdk/react'
import { useState, useEffect, useRef } from 'react'

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

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input, textareaRef])

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
