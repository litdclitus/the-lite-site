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
    <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
      {messages.map((m, idx) => {
        const text = extractMessageText(m)

        return (
          <div key={m.id || idx} className="space-y-2">
            {/* User Message */}
            {m.role === 'user' && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-[20px] rounded-tr-md bg-[#27272A] px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-sm dark:bg-[#27272A]">
                  <MessageContent content={text} role="user" />
                </div>
              </div>
            )}

            {/* AI Message */}
            {m.role === 'assistant' && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-[20px] rounded-tl-md bg-white/90 px-4 py-2.5 text-[15px] leading-relaxed text-[#18181B] shadow-sm ring-1 ring-zinc-200/70 dark:bg-[#18181B]/90 dark:text-[#E5E4E2] dark:ring-zinc-800/80">
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
          <div className="rounded-[20px] rounded-tl-md border border-[#E5E4E2] bg-white px-4 py-3 dark:border-[#3A3A3C] dark:bg-[#252527]">
            <div className="flex gap-1.5">
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-[#9B9B9B]"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-[#9B9B9B]"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-[#9B9B9B]"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Message */}
      {isRateLimited && (
        <div className="rounded-[16px] border border-amber-200/50 bg-amber-50/80 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-200">
          You&apos;re sending too many messages. Please wait a moment and try
          again.
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
