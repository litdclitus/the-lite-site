import { commonPatterns } from '@/styles/class-patterns'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  isLoading: boolean
  isRateLimited: boolean
  canSend: boolean
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  textareaRef,
  isLoading,
  isRateLimited,
  canSend,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`shrink-0 border-t ${commonPatterns.subtleBorder} bg-white/90 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:bg-white/90 dark:bg-zinc-900/90`}
    >
      <div className="flex items-center gap-3">
        {/* Input Field */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading || isRateLimited}
            rows={1}
            className={`w-full resize-none overflow-hidden rounded-[15px] border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-900 ${commonPatterns.transitionColors} placeholder:text-zinc-400 md:text-base focus:border-zinc-300 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500`}
          />
        </div>

        {/* Send Button - RIGHT side, arrow style from Figma */}
        <button
          type="submit"
          disabled={!canSend}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            canSend
              ? 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600'
              : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
          aria-label="Send message"
        >
          <svg
            className="h-5 w-5 text-zinc-600 dark:text-zinc-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </form>
  )
}
