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
    <div className="flex h-full flex-col items-center justify-center px-4 py-6 md:py-8">
      {/* Robot Illustration Placeholder */}
      <div className="mb-6 md:mb-8">
        <div className="mx-auto flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
          {/* Placeholder for robot illustration */}
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-16 w-16 text-[var(--color-accent-primary)] md:h-20 md:w-20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-8 text-center md:mb-12">
        {/* Heading with emoji */}
        <h2 className="mb-3 text-xl font-bold text-[var(--color-accent-primary)] md:text-2xl">
          Yo, I&apos;m Lit Bot 👋
        </h2>

        {/* Subtitle */}
        <p className="max-w-[339px] text-sm leading-relaxed text-[var(--color-chat-muted)] md:text-base">
          My human is busy squashing bugs. Ask me quick—I need to go brew some
          Phin coffee.
        </p>
      </div>

      {/* Starter Questions - Horizontal scrollable on mobile, flexible width */}
      <div className="flex w-full gap-3 overflow-x-auto px-4 pb-2 md:flex-col md:items-center md:justify-center md:overflow-visible md:px-0">
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
