'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isDocked: boolean;
  setIsDocked: (value: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isDocked, setIsDocked] = useState(false);

  return (
    <ChatContext.Provider value={{ isDocked, setIsDocked }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
