import React, { memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExternalLink } from 'lucide-react'

interface MessageContentProps {
  content: string
  role: 'user' | 'assistant'
}

// Memoized markdown components for performance
const markdownComponents = {
  // Custom link rendering with external icon and Lit styling
  a: ({ node, children, href, ...props }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-teal-400 underline decoration-teal-400/30 underline-offset-4 transition-colors hover:text-teal-300 hover:decoration-teal-300/50 dark:text-teal-400 dark:hover:text-teal-300"
      {...props}
    >
      {children}
      <ExternalLink className="inline h-3 w-3 opacity-70" />
    </a>
  ),
  // Paragraph styling
  p: ({ node, children, ...props }: any) => (
    <p className="mb-2 last:mb-0" {...props}>
      {children}
    </p>
  ),
  // Code inline
  code: ({ node, inline, children, ...props }: any) =>
    inline ? (
      <code
        className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code
        className="block rounded-lg bg-zinc-100 p-3 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
        {...props}
      >
        {children}
      </code>
    ),
  // Bold text
  strong: ({ node, children, ...props }: any) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props}>
      {children}
    </strong>
  ),
  // Lists
  ul: ({ node, children, ...props }: any) => (
    <ul className="mb-2 ml-4 list-disc space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ node, children, ...props }: any) => (
    <ol className="mb-2 ml-4 list-decimal space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, ...props }: any) => (
    <li className="text-sm" {...props}>
      {children}
    </li>
  ),
}

const MessageContent = memo(({ content, role }: MessageContentProps) => {
  // Memoize the markdown rendering to prevent unnecessary re-renders
  const renderedContent = useMemo(
    () => (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    ),
    [content]
  )

  return <div className="wrap-break-word">{renderedContent}</div>
})

MessageContent.displayName = 'MessageContent'

export default MessageContent
