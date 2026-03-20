export const commonPatterns = {
  subtleBorder: 'border-zinc-200/70 dark:border-zinc-800',
  subtleRing: 'ring-1 ring-zinc-200/70 dark:ring-zinc-800/80',
  glassBlur: 'backdrop-blur-2xl md:backdrop-blur-sm',
  transitionColors: 'transition-colors',
} as const

export const chatPatterns = {
  panelShadow:
    'shadow-[0_0_40px_rgba(0,0,0,0.12)] dark:shadow-[0_0_50px_rgba(0,0,0,0.7)]',
  panelTransition:
    'transition-transform duration-300 ease-out will-change-transform',
  bubbleUserRadius: 'rounded-[15px] rounded-br-[10px]',
  bubbleAssistantRadius: 'rounded-[15px] rounded-bl-[10px]',
  bubbleLoadingRadius: 'rounded-[15px] rounded-bl-[10px]',
  bubbleText: 'px-4 py-2 text-[14px] leading-relaxed md:text-[15px]',
} as const
