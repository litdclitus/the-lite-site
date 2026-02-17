import type { UIMessage } from '@ai-sdk/react'
import MessageContent from '@/components/MessageContent'
import { extractMessageText } from '@/utils/messageUtils'

interface ChatMessagesProps {
  messages: UIMessage[]
  isLoading: boolean
  isRateLimited: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function ChatMessages({
  messages,
  isLoading,
  isRateLimited,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div
      data-chat-messages-scroll
      className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 md:space-y-5 md:px-5 md:py-6"
    >
      {messages.map((m, idx) => {
        const text = extractMessageText(m)

        return (
          <div key={m.id || idx} className="space-y-2">
            {/* User Message */}
            {m.role === 'user' && (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-[16px] rounded-tr-md bg-[#27272A] px-3 py-2 text-[14px] leading-relaxed text-white shadow-sm md:max-w-[80%] md:rounded-[20px] md:px-4 md:py-2.5 md:text-[15px] dark:bg-[#27272A]">
                  <MessageContent content={text} role="user" />
                </div>
              </div>
            )}

            {/* AI Message */}
            {m.role === 'assistant' && (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-[16px] rounded-tl-md bg-white/90 px-3 py-2 text-[14px] leading-relaxed text-[#18181B] shadow-sm ring-1 ring-zinc-200/70 md:max-w-[85%] md:rounded-[20px] md:px-4 md:py-2.5 md:text-[15px] dark:bg-[#18181B]/90 dark:text-[#E5E4E2] dark:ring-zinc-800/80">
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
          <div className="rounded-[16px] rounded-tl-md border border-[#E5E4E2] bg-white px-3 py-2 md:rounded-[20px] md:px-4 md:py-3 dark:border-[#3A3A3C] dark:bg-[#252527]">
            <div className="flex gap-1.5">
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] md:h-2 md:w-2"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] md:h-2 md:w-2"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B9B9B] md:h-2 md:w-2"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Message */}
      {isRateLimited && (
        <div className="rounded-[14px] border border-amber-200/50 bg-amber-50/80 px-3 py-2 text-xs text-amber-800 md:rounded-[16px] md:px-4 md:py-3 md:text-sm dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-200">
          You&apos;re sending too many messages. Please wait a moment and try
          again.
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
