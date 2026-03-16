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
  bubbleUserRadius: 'rounded-[16px] rounded-tr-md md:rounded-[20px]',
  bubbleAssistantRadius: 'rounded-[16px] rounded-tl-md md:rounded-[20px]',
  bubbleLoadingRadius: 'rounded-[16px] rounded-tl-md md:rounded-[20px]',
  bubbleText: 'px-3 py-2 text-[14px] leading-relaxed md:px-4 md:py-2.5 md:text-[15px]',
} as const
