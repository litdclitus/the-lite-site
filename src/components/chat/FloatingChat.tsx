import { useState, useRef } from 'react'

interface FloatingChatProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  isRateLimited: boolean
  canSend: boolean
  hasScrolledAndStopped: boolean
}

export default function FloatingChat({
  input,
  setInput,
  onSubmit,
  isLoading,
  isRateLimited,
  canSend,
  hasScrolledAndStopped,
}: FloatingChatProps) {
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false)
  const floatingContainerRef = useRef<HTMLDivElement>(null)
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null)

  return (
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
          onSubmit={onSubmit}
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
              ? 'border-zinc-300 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.14)] dark:border-zinc-600 dark:bg-[var(--color-chat-input-bg)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.7)]'
              : hasScrolledAndStopped
                ? 'border-zinc-300 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:border-[var(--color-floating-button-border)] dark:bg-[var(--color-chat-input-bg)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                : 'border-zinc-200 bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-[var(--color-chat-input-bg)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.6)]'
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSubmit(e as any)
              }
            }}
            onFocus={() => {
              setIsFloatingExpanded(true)
              if (collapseTimerRef.current) {
                clearTimeout(collapseTimerRef.current)
                collapseTimerRef.current = null
              }
            }}
            onBlur={() => setIsFloatingExpanded(false)}
            placeholder="Ask a question..."
            disabled={isLoading || isRateLimited}
            className="flex-1 border-0 bg-transparent text-base text-[var(--color-floating-chat-text)] outline-none placeholder:text-[var(--color-floating-chat-placeholder)] disabled:cursor-not-allowed disabled:opacity-50"
          />
          {isRateLimited ? (
            <div className="shrink-0 text-xs text-amber-500 dark:text-amber-400">
              Rate limited
            </div>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              className={`shrink-0 rounded-full bg-[var(--color-floating-chat-send-bg)] p-1.5 text-[var(--color-floating-chat-send-text)] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                canSend
                  ? 'hover:bg-[var(--color-accent-primary)] hover:text-white'
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
  )
}
