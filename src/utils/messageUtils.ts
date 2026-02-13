import type { UIMessage } from '@ai-sdk/react'

export function extractMessageText(message: UIMessage): string {
  if ('parts' in message && Array.isArray(message.parts)) {
    return message.parts
      .map((part: unknown) => {
        if (typeof part === 'string') return part
        if (
          part &&
          typeof part === 'object' &&
          'type' in part &&
          part.type === 'text' &&
          'text' in part &&
          typeof part.text === 'string'
        ) {
          return part.text
        }
        return ''
      })
      .filter(Boolean)
      .join('')
  }
  return ''
}
