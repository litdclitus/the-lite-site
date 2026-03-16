import type { UIMessage } from '@ai-sdk/react'
import { useRef } from 'react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { useVisualViewportPanelSizing } from '@/hooks/useVisualViewportPanelSizing'
import { chatPatterns, commonPatterns } from '@/styles/class-patterns'

interface ChatPanelProps {
  isDocked: boolean
  onClose: () => void
  messages: UIMessage[]
  isLoading: boolean
  isRateLimited: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  canSend: boolean
  onSendMessage?: (message: string) => void
}

export default function ChatPanel({
  isDocked,
  onClose,
  messages,
  isLoading,
  isRateLimited,
  messagesEndRef,
  input,
  setInput,
  onSubmit,
  textareaRef,
  canSend,
  onSendMessage,
}: ChatPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  useVisualViewportPanelSizing({
    enabled: isDocked && isMobile,
    panelRef,
  })

  return (
    <div
      ref={panelRef}
      className={`fixed top-0 right-0 z-[9999] flex h-screen min-h-0 w-full flex-col overflow-hidden rounded-none border-l border-zinc-200 bg-white shadow-2xl ${chatPatterns.panelTransition} md:w-[min(420px,30vw)] md:rounded-t-[40px] dark:border-zinc-800 dark:bg-zinc-950 ${
        isDocked ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header - Figma style with avatar */}
      <div
        className={`flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:pt-3 dark:border-zinc-800 dark:bg-zinc-900/95`}
      >
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dbd1fc]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6 text-zinc-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>

          {/* Title and Subtitle */}
          <div className="flex flex-col">
            <h3 className="text-base leading-tight font-bold text-zinc-900 dark:text-zinc-100">
              Lit Bot
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Caffeine-powered AI ☕
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Close chat"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
        messagesEndRef={messagesEndRef}
        onSendMessage={onSendMessage}
      />

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        textareaRef={textareaRef}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
        canSend={canSend}
      />

      {/* Footer - Powered by text */}
      <div className="shrink-0 border-t border-zinc-200 bg-white/80 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900/80">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Powered by{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            litdclitus
          </span>
        </p>
      </div>
    </div>
  )
}
