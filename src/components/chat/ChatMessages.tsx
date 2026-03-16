import type { UIMessage } from '@ai-sdk/react'
import MessageContent from '@/components/MessageContent'
import { chatPatterns, commonPatterns } from '@/styles/class-patterns'
import { extractMessageText } from '@/utils/messageUtils'
import WelcomeScreen from './WelcomeScreen'

interface ChatMessagesProps {
  messages: UIMessage[]
  isLoading: boolean
  isRateLimited: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  onSendMessage?: (message: string) => void
}

export default function ChatMessages({
  messages,
  isLoading,
  isRateLimited,
  messagesEndRef,
  onSendMessage,
}: ChatMessagesProps) {
  // Show welcome screen when no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <div
        data-chat-messages-scroll
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <WelcomeScreen
          onQuestionClick={(question) => {
            if (onSendMessage) {
              onSendMessage(question)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      data-chat-messages-scroll
      className="relative min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 md:space-y-5 md:px-5 md:py-6"
    >
      {messages.map((m, idx) => {
        const text = extractMessageText(m)

        return (
          <div key={m.id || idx} className="relative z-10 space-y-2">
            {/* User Message - NO AVATAR */}
            {m.role === 'user' && (
              <div className="flex items-end justify-end">
                {/* Message Bubble - Flat rounded style */}
                <div className="max-w-[85%] rounded-[15px] rounded-br-[10px] bg-[var(--color-accent-primary)] px-4 py-2 text-[14px] leading-relaxed text-white shadow-sm md:max-w-[80%] md:text-[15px]">
                  <MessageContent content={text} role="user" />
                </div>
              </div>
            )}

            {/* AI Message */}
            {m.role === 'assistant' && (
              <div className="flex items-end justify-start gap-2">
                {/* Bot Avatar - Small circular with logo */}
                <div className="mb-0.5 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-primary)] shadow-sm md:flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="white"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                    />
                  </svg>
                </div>

                {/* Message Bubble - Light gray with border */}
                <div className="max-w-[90%] rounded-[15px] rounded-bl-[10px] border border-zinc-200 bg-[rgba(174,174,174,0.12)] px-4 py-2 text-[14px] leading-relaxed text-[var(--color-chat-assistant-bubble-text)] shadow-sm md:max-w-[85%] md:text-[15px] dark:border-zinc-700 dark:bg-[rgba(60,60,60,0.3)]">
                  <MessageContent content={text} role="assistant" />
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="relative z-10 flex justify-start">
          <div
            className={`${chatPatterns.bubbleLoadingRadius} border border-[var(--color-chat-loading-border)] bg-[var(--color-chat-loading-bg)] px-3 py-2 md:px-4 md:py-3`}
          >
            <div className="flex gap-1.5">
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-chat-loading-dot)] md:h-2 md:w-2"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-chat-loading-dot)] md:h-2 md:w-2"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-chat-loading-dot)] md:h-2 md:w-2"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Message */}
      {isRateLimited && (
        <div className="relative z-10 rounded-[14px] border border-amber-200/50 bg-amber-50/80 px-3 py-2 text-xs text-amber-800 md:rounded-[16px] md:px-4 md:py-3 md:text-sm dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-200">
          You&apos;re sending too many messages. Please wait a moment and try
          again.
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
