interface WelcomeScreenProps {
  onQuestionClick: (question: string) => void
}

const starterQuestions = [
  {
    id: 1,
    question: 'How old are you, really?',
  },
  {
    id: 2,
    question: 'Why is this site so fast?',
  },
  {
    id: 3,
    question: 'Roast this portfolio',
  },
]

export default function WelcomeScreen({ onQuestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-between px-4 py-6 md:py-8">
      {/* Welcome Message */}
      <div className="mt-6 text-center md:mt-20">
        {/* Heading with emoji */}
        <h2 className="mb-3 text-xl font-bold text-[var(--color-accent-primary)] md:text-2xl">
          Yo, I&apos;m Lit Bot 👋
        </h2>

        {/* Subtitle */}
        <p className="max-w-[339px] text-sm leading-relaxed text-[var(--color-chat-muted)] md:text-base">
          My human is busy squashing bugs. Ask me quick — I need to go brew some
          Phin coffee.
        </p>
      </div>

      {/* Starter Questions - Horizontal scrollable on mobile, flexible width */}
      <div className="flex w-full gap-3 overflow-x-auto px-4 pb-0 md:flex-col md:items-center md:justify-center md:overflow-visible md:px-0">
        {starterQuestions.map((item) => (
          <button
            key={item.id}
            onClick={() => onQuestionClick(item.question)}
            className="shrink-0 rounded-[10px] border border-[#165dff] bg-[rgba(22,93,255,0.1)] px-[14px] py-[6px] text-sm font-medium whitespace-nowrap text-[#165dff] transition-all hover:bg-[rgba(22,93,255,0.15)] active:scale-[0.98] dark:border-[#165dff] dark:bg-[rgba(22,93,255,0.15)] dark:text-[#4a9eff] dark:hover:bg-[rgba(22,93,255,0.2)]"
          >
            {item.question}
          </button>
        ))}
      </div>
    </div>
  )
}
