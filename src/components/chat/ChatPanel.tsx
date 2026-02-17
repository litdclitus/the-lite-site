import type { UIMessage } from '@ai-sdk/react'
import { useRef } from 'react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { useVisualViewportPanelSizing } from '@/hooks/useVisualViewportPanelSizing'

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
      className={`fixed right-0 z-[9999] h-screen border-l border-zinc-200/70 bg-white/[0.98] backdrop-blur-2xl transition-transform duration-300 ease-out will-change-transform dark:border-zinc-800 dark:bg-zinc-950/[0.99] md:bg-[#F9FAFB] md:backdrop-blur-sm md:dark:bg-[#020617cc] ${
        isDocked ? 'translate-x-0' : 'translate-x-full'
      } top-0 flex w-full min-h-0 flex-col shadow-[0_0_40px_rgba(0,0,0,0.12)] md:w-[min(500px,30vw)] dark:shadow-[0_0_50px_rgba(0,0,0,0.7)]`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200/70 bg-white/[0.9] px-3 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur-2xl md:bg-white/80 md:px-5 md:py-4 md:pt-4 md:backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/[0.88] md:dark:bg-[#020617]/80">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#5EEAD4"
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

          <h3 className="text-lg font-medium text-[#2C2C2E] md:text-xl dark:text-[#E5E4E2]">
            Lit Bot
          </h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-[#6B6B6B] transition-colors md:p-2 hover:bg-[#E5E4E2]/50 dark:text-[#9B9B9B] dark:hover:bg-[#2C2C2E]/50"
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
