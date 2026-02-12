'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from '@ai-sdk/react'
import { useState, useEffect, useRef } from 'react'
import { useChatContext } from '@/contexts/ChatContext'
import MessageContent from '@/components/MessageContent'

export default function ChatWidget() {
  const { isDocked, setIsDocked } = useChatContext()
  const [input, setInput] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false)
  const [hasScrolledAndStopped, setHasScrolledAndStopped] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const floatingContainerRef = useRef<HTMLDivElement>(null)
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollYRef = useRef(0)

  const { messages, sendMessage, status, setMessages } = useChat({
    onFinish: () => {
      // Reset textarea height and auto-focus after AI response completes
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        // Small delay to ensure smooth focus transition
        setTimeout(() => {
          textareaRef.current?.focus()
        }, 100)
      }
    },
    onError: (err) => {
      console.error('❌ Chat error:', err)
      setIsRateLimited(true)
      setTimeout(() => {
        setIsRateLimited(false)
      }, 90000)
      // Focus back on error
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    },
  })

  // Auto trim messages to keep only recent 30 (15 pairs)
  useEffect(() => {
    if (messages.length > 30) {
      const recentMessages = messages.slice(-30)
      setMessages(recentMessages)
    }
  }, [messages, setMessages])

  // Reset floating expanded state when docked changes or component mounts
  useEffect(() => {
    setIsFloatingExpanded(false)
  }, [isDocked])

  const isLoading = status === 'streaming' || status === 'submitted'
  const canSend = !!input.trim() && !isLoading && !isRateLimited

  // Auto scroll to bottom when new messages arrive
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
  }, [input])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+I to open chat panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        if (!isDocked) {
          setIsDocked(true)
          setTimeout(() => {
            textareaRef.current?.focus()
          }, 350)
        }
      }
      // ESC to close chat panel
      if (e.key === 'Escape' && isDocked) {
        setIsDocked(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDocked, setIsDocked])

  // Scroll detection: expand only when scrolling UP to top, auto-collapse after 5s
  useEffect(() => {
    if (isDocked) {
      // Reset state when docked
      setHasScrolledAndStopped(false)
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDirection =
        currentScrollY < lastScrollYRef.current ? 'up' : 'down'
      lastScrollYRef.current = currentScrollY

      // Clear existing timer
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }

      // Only expand when:
      // 1. Scrolling UP
      // 2. AND at or near top (< 50px)
      if (scrollDirection === 'up' && currentScrollY < 50) {
        setHasScrolledAndStopped(true)

        // Auto-collapse after 5 seconds
        collapseTimerRef.current = setTimeout(() => {
          setHasScrolledAndStopped(false)
        }, 5000)
      } else {
        // Collapse immediately when:
        // 1. Scrolling down
        // 2. OR away from top (>= 50px)
        setHasScrolledAndStopped(false)
      }
    }

    // Initial state: collapsed
    setHasScrolledAndStopped(false)
    lastScrollYRef.current = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
      // Reset state on cleanup (route change)
      setHasScrolledAndStopped(false)
    }
  }, [isDocked])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSend) return

    const userInput = input.trim()
    const wasDockedBefore = isDocked

    // Clear input immediately
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    // Always transition to docked mode when sending a message
    setIsDocked(true)

    // Auto-focus textarea after sending message
    // If already docked: focus immediately after state updates
    // If transitioning from floating: wait for panel animation (300ms + buffer)
    const focusDelay = wasDockedBefore ? 50 : 350
    setTimeout(() => {
      textareaRef.current?.focus()
    }, focusDelay)

    try {
      await sendMessage({ text: userInput })
    } catch (err) {
      console.error('Send error:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleClose = () => {
    setIsDocked(false)
  }

  // Extract text from message parts with proper typing
  const getMessageText = (message: UIMessage): string => {
    // Handle UIMessage format from @ai-sdk/react
    if ('parts' in message && Array.isArray(message.parts)) {
      return message.parts
        .map((part: unknown) => {
          if (typeof part === 'string') return part
          if (
            part &&
            typeof part === 'object' &&
            'type' in part &&
            part.type === 'text' &&
            'text' in part &&
            typeof part.text === 'string'
          ) {
            return part.text
          }
          return ''
        })
        .filter(Boolean)
        .join('')
    }
    return ''
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isDocked && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Docked Chat Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen border-l border-zinc-200/70 bg-[#F9FAFB] transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-[#020617cc] ${
          isDocked ? 'translate-x-0' : 'translate-x-full'
        } flex w-full flex-col shadow-[0_0_40px_rgba(0,0,0,0.12)] md:w-[min(500px,30vw)] dark:shadow-[0_0_50px_rgba(0,0,0,0.7)]`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200/70 bg-white/80 px-5 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-[#020617]/80">
          <div className="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#5EEAD4"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>

            <h3 className="text-xl font-medium text-[#2C2C2E] dark:text-[#E5E4E2]">
              Lit Bot
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-[#6B6B6B] transition-colors hover:bg-[#E5E4E2]/50 dark:text-[#9B9B9B] dark:hover:bg-[#2C2C2E]/50"
            aria-label="Close chat"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {messages.map((m, idx) => {
            const text = getMessageText(m)

            return (
              <div key={m.id || idx} className="space-y-2">
                {/* User Message */}
                {m.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-[20px] rounded-tr-md bg-[#27272A] px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-sm dark:bg-[#27272A]">
                      <MessageContent content={text} role="user" />
                    </div>
                  </div>
                )}

                {/* AI Message - with streaming support */}
                {m.role === 'assistant' && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-[20px] rounded-tl-md bg-white/90 px-4 py-2.5 text-[15px] leading-relaxed text-[#18181B] shadow-sm ring-1 ring-zinc-200/70 dark:bg-[#18181B]/90 dark:text-[#E5E4E2] dark:ring-zinc-800/80">
                      <MessageContent content={text} role="assistant" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-[20px] rounded-tl-md border border-[#E5E4E2] bg-white px-4 py-3 dark:border-[#3A3A3C] dark:bg-[#252527]">
                <div className="flex gap-1.5">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#9B9B9B]"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#9B9B9B]"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#9B9B9B]"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Message - for all errors */}
          {isRateLimited && (
            <div className="rounded-[16px] border border-amber-200/50 bg-amber-50/80 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-200">
              You&apos;re sending too many messages. Please wait a moment and
              try again.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-zinc-200/70 bg-white/80 p-5 backdrop-blur-sm dark:border-zinc-800 dark:bg-[#020617]/80"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={isLoading || isRateLimited}
                rows={1}
                className="w-full resize-none overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/90 px-4 py-3 text-[15px] leading-relaxed text-[#18181B] shadow-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#3A3A3C] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] dark:placeholder:text-[#71717A]"
              />
            </div>
            <button
              type="submit"
              disabled={!canSend}
              className={`mb-0.5 shrink-0 rounded-full bg-[#111827] p-2.5 text-sm font-medium text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#E5E4E2] dark:text-[#020617] ${
                canSend ? 'hover:bg-[#020617] dark:hover:bg-[#D4D3D1]' : ''
              }`}
              aria-label="Send message"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Floating Input Card - Intent-based expandable */}
      {!isDocked && (
        <>
          {/* Backdrop overlay when focused */}
          {isFloatingExpanded && (
            <div className="fixed inset-0 z-30 bg-black/5 backdrop-blur-[2px] transition-all duration-250 dark:bg-black/20" />
          )}

          <div
            ref={floatingContainerRef}
            className="fixed bottom-12 left-1/2 z-40 hidden -translate-x-1/2 md:block"
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width:
                  isFloatingExpanded || hasScrolledAndStopped
                    ? 'min(526px, 90vw)'
                    : '248px',
                height: '50px',
                transition: 'all 250ms ease-out',
              }}
              className={`flex items-center gap-3 rounded-[18px] border px-4 transition-all duration-250 ${
                isFloatingExpanded
                  ? 'border-zinc-300 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.14)] dark:border-[#4A4A4C] dark:bg-[#18181B] dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)]'
                  : hasScrolledAndStopped
                    ? 'border-zinc-300 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:border-[#3A3A3C] dark:bg-[#18181B] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                    : 'border-zinc-200 bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:border-[#27272A] dark:bg-[#18181B]/95 dark:shadow-[0_2px_12px_rgba(0,0,0,0.6)]'
              }`}
            >
              <input
                ref={textareaRef as any}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e as any)
                  }
                }}
                onFocus={() => {
                  setIsFloatingExpanded(true)
                  // Cancel auto-collapse timer when user is interacting
                  if (collapseTimerRef.current) {
                    clearTimeout(collapseTimerRef.current)
                    collapseTimerRef.current = null
                  }
                }}
                onBlur={() => setIsFloatingExpanded(false)}
                placeholder="Ask a question..."
                disabled={isLoading || isRateLimited}
                className="flex-1 border-0 bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#E5E4E2] dark:placeholder:text-[#9B9B9B]"
              />
              {isRateLimited ? (
                <div className="shrink-0 text-xs text-amber-500 dark:text-amber-400">
                  Rate limited
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!canSend}
                  className={`shrink-0 rounded-full bg-zinc-100 p-1.5 text-zinc-600 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-[#E5E4E2] ${
                    canSend
                      ? 'hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white'
                      : ''
                  }`}
                  aria-label="Send"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </>
      )}

      {/* Mobile: Floating button to open chat */}
      {!isDocked && (
        <button
          onClick={() => setIsDocked(true)}
          className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[#3A3A3C] bg-[#2C2C2E] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-110 active:scale-95 md:hidden dark:bg-[#252527]"
          aria-label="Open chat"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </>
  )
}
