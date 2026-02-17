'use client'

import { useRef, useState, useEffect } from 'react'
import { useChatContext } from '@/contexts/ChatContext'
import { useChatLogic } from '@/hooks/useChatLogic'
import { useMobileOptimization } from '@/hooks/useMobileOptimization'
import { useAutoFocus } from '@/hooks/useAutoFocus'
import { useFloatingChat } from '@/hooks/useFloatingChat'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import ChatPanel from '@/components/chat/ChatPanel'
import FloatingChat from '@/components/chat/FloatingChat'
import FloatingButton from '@/components/chat/FloatingButton'

export default function ChatWidget() {
  const { isDocked, setIsDocked } = useChatContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Chat logic
  const {
    input,
    setInput,
    messages,
    isLoading,
    isRateLimited,
    canSend,
    handleSubmit,
    messagesEndRef,
  } = useChatLogic({
    textareaRef,
    onPanelOpen: () => setIsDocked(true),
  })

  // Mobile optimization (body scroll lock only)
  useMobileOptimization(isDocked)

  // Auto-focus
  useAutoFocus(isDocked, textareaRef)

  // Floating chat behavior
  const { hasScrolledAndStopped } = useFloatingChat(isDocked)

  // Keyboard shortcuts
  useKeyboardShortcuts(
    isDocked,
    () => setIsDocked(true),
    () => setIsDocked(false),
  )

  // Reset floating expanded state when docked changes
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false)
  useEffect(() => {
    setIsFloatingExpanded(false)
  }, [isDocked])

  const handleClose = () => setIsDocked(false)

  return (
    <>
      {/* Backdrop Overlay - Mobile ONLY */}
      {isDocked && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xl md:hidden"
          onClick={handleClose}
        />
      )}

      {/* Docked Chat Panel */}
      <ChatPanel
        isDocked={isDocked}
        onClose={handleClose}
        messages={messages}
        isLoading={isLoading}
        isRateLimited={isRateLimited}
        messagesEndRef={messagesEndRef}
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        textareaRef={textareaRef}
        canSend={canSend}
      />

      {/* Floating Input Card - Desktop only */}
      {!isDocked && (
        <FloatingChat
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isRateLimited={isRateLimited}
          canSend={canSend}
          hasScrolledAndStopped={hasScrolledAndStopped}
        />
      )}

      {/* Mobile Floating Button */}
      {!isDocked && <FloatingButton onClick={() => setIsDocked(true)} />}
    </>
  )
}
