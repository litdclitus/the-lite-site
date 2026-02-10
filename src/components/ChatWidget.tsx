'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  const [isDocked, setIsDocked] = useState(false);
  const [input, setInput] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, sendMessage, status, error, setMessages } = useChat({
    onFinish: () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    onError: (err) => {
      // Check if it's a rate limit error
      if (err.message.includes('429') || err.message.toLowerCase().includes('rate') || err.message.toLowerCase().includes('too many')) {
        setIsRateLimited(true);
        // Re-enable after 2 minutes
        setTimeout(() => {
          setIsRateLimited(false);
        }, 120000); // 2 minutes
      }
    },
  });
  
  // Auto trim messages to keep only recent 8 (4 pairs)
  useEffect(() => {
    if (messages.length > 8) {
      const recentMessages = messages.slice(-8);
      setMessages(recentMessages);
    }
  }, [messages, setMessages]);
  
  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isRateLimited) return;
    
    const userInput = input.trim();
    
    // Clear input immediately
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Always transition to docked mode when sending a message
    setIsDocked(true);
    
    try {
      await sendMessage({ text: userInput });
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClose = () => {
    setIsDocked(false);
  };

  // Extract text from message parts
  const getMessageText = (message: any): string => {
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts
        .map((part: any) => {
          if (typeof part === 'string') return part;
          if (part.text) return part.text;
          if (part.type === 'text' && part.text) return part.text;
          return '';
        })
        .filter(Boolean)
        .join('');
    }
    return '';
  };

  return (
    <>
      {/* Docked Chat Panel - Right side panel */}
      <div
        className={`
          fixed top-0 right-0 h-screen z-50
          light:bg-[#F8F7F5] dark:bg-[#1C1C1E]
          border-l border-[#E5E4E2] dark:border-[#2C2C2E]
          transition-all duration-300 ease-out
          ${isDocked ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
          shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]
        `}
        style={{
          width: isDocked ? 'min(450px, 35vw)' : '0',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E4E2] dark:border-[#2C2C2E] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-medium text-[#2C2C2E] dark:text-[#E5E4E2]">
              Chat with Lit AI
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-[#E5E4E2]/50 dark:hover:bg-[#2C2C2E]/50 transition-colors text-[#6B6B6B] dark:text-[#9B9B9B]"
            aria-label="Close chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.map((m, idx) => {
            const text = getMessageText(m);
            
            return (
              <div key={m.id || idx} className="space-y-2">
                {/* User Message */}
                {m.role === 'user' && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-[#2C2C2E] dark:bg-[#3A3A3C] text-white rounded-[20px] rounded-tr-md px-4 py-2.5 text-[15px] leading-relaxed">
                      <div className="whitespace-pre-wrap break-words">{text}</div>
                    </div>
                  </div>
                )}

                {/* AI Message */}
                {m.role === 'assistant' && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-white dark:bg-[#252527] text-[#2C2C2E] dark:text-[#E5E4E2] rounded-[20px] rounded-tl-md px-4 py-2.5 text-[15px] leading-relaxed border border-[#E5E4E2] dark:border-[#3A3A3C]">
                      <div className="whitespace-pre-wrap break-words">{text}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-[#252527] rounded-[20px] rounded-tl-md px-4 py-3 border border-[#E5E4E2] dark:border-[#3A3A3C]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit Message */}
          {isRateLimited && (
            <div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 rounded-[16px] px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              You&apos;re sending too many messages. Please wait a moment and try again.
            </div>
          )}

          {/* Error Message */}
          {error && !isRateLimited && (
            <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-[16px] px-4 py-3 text-sm text-red-800 dark:text-red-200">
              <strong className="font-semibold">Error:</strong> {error.message}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <form onSubmit={handleSubmit} className="shrink-0 p-5 border-t border-[#E5E4E2] dark:border-[#2C2C2E]">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={isLoading || isRateLimited}
                rows={1}
                className="
                  w-full resize-none overflow-hidden
                  bg-white dark:bg-[#252527]
                  border border-[#E5E4E2] dark:border-[#3A3A3C]
                  rounded-[16px]
                  px-4 py-3
                  text-[15px] leading-relaxed
                  text-[#2C2C2E] dark:text-[#E5E4E2]
                  placeholder:text-[#9B9B9B]
                  focus:outline-none focus:ring-2 focus:ring-[#2C2C2E]/20 dark:focus:ring-[#E5E4E2]/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all
                "
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isRateLimited}
              className="
                px-4 py-3 rounded-[16px]
                bg-[#2C2C2E] dark:bg-[#E5E4E2]
                text-white dark:text-[#1C1C1E]
                hover:bg-[#3A3A3C] dark:hover:bg-[#D4D3D1]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all
                shrink-0
                font-medium text-sm
              "
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Floating Input Card - Centered at bottom when not docked */}
      {!isDocked && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-[640px] px-4">
          <form 
            onSubmit={handleSubmit} 
            className="
              bg-[#2C2C2E] dark:bg-[#252527]
              border border-[#3A3A3C] dark:border-[#3A3A3C]
              rounded-[20px]
              shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
              transition-all duration-200 ease-out
              hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
              focus-within:scale-[1.02] focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
              focus-within:border-[#4A4A4C] dark:focus-within:border-[#4A4A4C]
            "
          >
            <div className="flex gap-3 items-end p-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={isLoading || isRateLimited}
                  rows={1}
                  className="
                    w-full resize-none overflow-hidden
                    bg-transparent
                    border-0
                    px-0 py-0
                    text-[15px] leading-relaxed
                    text-white dark:text-[#E5E4E2]
                    placeholder:text-[#9B9B9B]
                    focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                />
              </div>
              {isRateLimited ? (
                <div className="text-xs text-amber-400 shrink-0 px-2">
                  Rate limited
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="
                    p-2 rounded-[12px]
                    bg-white/10 dark:bg-white/10
                    text-white dark:text-[#E5E4E2]
                    hover:bg-white/20 dark:hover:bg-white/20
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all
                    shrink-0
                  "
                  aria-label="Send"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
