import type { UIMessage } from '@ai-sdk/react'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

interface ChatPanelProps {
  isDocked: boolean
  onClose: () => void
  viewportHeight: number | null
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
  viewportHeight,
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
  return (
    <div
      className={`fixed top-0 right-0 z-[9999] h-screen md:h-screen border-l border-zinc-200/70 bg-[#F9FAFB] transition-all duration-300 ease-out dark:border-zinc-800 dark:bg-[#020617cc] ${
        isDocked ? 'translate-x-0' : 'translate-x-full'
      } flex w-full flex-col shadow-[0_0_40px_rgba(0,0,0,0.12)] md:w-[min(500px,30vw)] dark:shadow-[0_0_50px_rgba(0,0,0,0.7)]`}
      style={
        viewportHeight && isDocked ? { height: `${viewportHeight}px` } : undefined
      }
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
          onClick={onClose}
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
