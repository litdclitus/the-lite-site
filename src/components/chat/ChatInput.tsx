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
      className="shrink-0 border-t border-zinc-200/70 bg-white/70 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-2xl md:bg-white/80 md:p-5 md:backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70 md:dark:bg-[#020617]/80"
    >
      <div className="flex items-center gap-1.5 md:gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading || isRateLimited}
            rows={1}
            className="w-full resize-none overflow-hidden rounded-xl border border-zinc-200/70 bg-white/90 px-3 py-2 text-sm leading-relaxed text-[#18181B] shadow-sm transition-colors placeholder:text-zinc-400 md:rounded-2xl md:px-4 md:py-3 md:text-base focus:border-zinc-500 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#3A3A3C] dark:bg-[#18181B]/90 dark:text-[#F4F4F5] dark:placeholder:text-[#71717A]"
          />
        </div>
        <button
          type="submit"
          disabled={!canSend}
          className={`mb-0.5 shrink-0 rounded-full bg-[#111827] p-2 text-sm font-medium text-white shadow-sm transition-colors md:p-2.5 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#E5E4E2] dark:text-[#020617] ${
            canSend ? 'hover:bg-[#020617] dark:hover:bg-[#D4D3D1]' : ''
          }`}
          aria-label="Send message"
        >
          <svg
            className="h-3.5 w-3.5 md:h-4 md:w-4"
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
  )
}
