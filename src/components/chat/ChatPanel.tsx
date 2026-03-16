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
      className={`fixed right-0 top-0 z-[9999] flex h-screen w-full min-h-0 flex-col border-l ${commonPatterns.subtleBorder} ${commonPatterns.glassBlur} ${chatPatterns.panelTransition} ${chatPatterns.panelShadow} bg-[var(--color-chat-panel-bg)] md:w-[min(500px,30vw)] md:bg-[var(--color-chat-panel-bg-md)] ${
        isDocked ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div
        className={`flex shrink-0 items-center justify-between border-b ${commonPatterns.subtleBorder} ${commonPatterns.glassBlur} bg-[var(--color-chat-header-bg)] px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:bg-[var(--color-chat-header-bg-md)] md:px-5 md:py-4 md:pt-4`}
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--color-accent-primary)"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 md:size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>

          <h3 className="text-lg font-medium text-[var(--color-chat-title)] md:text-xl">
            Lit Bot
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-[var(--color-chat-muted)] transition-colors md:p-2 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/40"
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

      {/* Messages */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
        messagesEndRef={messagesEndRef}
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
    </div>
  )
}
