interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[#3A3A3C] bg-[#2C2C2E] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:scale-110 active:scale-95 md:hidden dark:bg-[#252527]"
      aria-label="Open chat"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>
  )
}
