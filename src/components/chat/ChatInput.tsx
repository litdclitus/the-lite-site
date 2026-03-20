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
      className={`shrink-0 border-t ${commonPatterns.subtleBorder} bg-white/80 px-4 py-3 backdrop-blur ${commonPatterns.transitionColors} md:px-5 md:py-3.5 md:bg-white/85 dark:bg-zinc-900/75`}
    >
      <div className="flex items-end gap-2.5 md:gap-3">
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
            className={`max-h-40 w-full resize-none overflow-hidden rounded-2xl border border-zinc-200/70 bg-white px-4 py-2.5 text-[15px] leading-relaxed text-zinc-900 shadow-[0_1px_10px_rgba(0,0,0,0.04)] ${commonPatterns.transitionColors} placeholder:text-zinc-400 md:text-[15px] focus:border-zinc-300 focus:shadow-[0_2px_14px_rgba(0,0,0,0.07)] focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700/80 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:shadow-none dark:focus:border-zinc-600`}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!canSend}
          className={`mb-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
            canSend
              ? 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600'
              : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
          aria-label="Send message"
        >
          <svg
            className="h-4 w-4 md:h-5 md:w-5"
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
