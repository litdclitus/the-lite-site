import type { UIMessage } from '@ai-sdk/react'
import { useRef } from 'react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ChatAvatar from './ChatAvatar'
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
      className={`fixed top-0 right-0 z-[9999] flex h-screen min-h-0 w-full flex-col overflow-hidden rounded-none border-l border-zinc-200 bg-white shadow-2xl ${chatPatterns.panelTransition} md:w-[min(480px,32vw)] md:rounded-t-[40px] dark:border-zinc-800 dark:bg-zinc-950 ${
        isDocked ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header - Figma style with avatar */}
      <div
        className={`flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:pt-3 dark:border-zinc-800 dark:bg-zinc-900/95`}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <ChatAvatar size="md" />

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
      <div className="shrink-0 border-t border-zinc-200 bg-white/80 py-1 text-center dark:border-zinc-800 dark:bg-zinc-900/80">
        <p className="text-xxs text-zinc-500 dark:text-zinc-400">
          Powered by{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            litdclitus
          </span>
        </p>
      </div>
    </div>
  )
}
