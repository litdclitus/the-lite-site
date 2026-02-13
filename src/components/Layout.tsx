'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { useChatContext } from '@/contexts/ChatContext'
import { useEffect, useState } from 'react'

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDocked } = useChatContext()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // md breakpoint
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const shouldAdjustLayout = isDocked && isDesktop

  return (
    <>
      {/* Background layer */}
      <div
        className="fixed inset-0 flex justify-center transition-all duration-300 ease-out sm:px-8"
        style={{
          right: shouldAdjustLayout ? 'min(500px, 30vw)' : '0',
        }}
      >
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>

      {/* Content layer */}
      <div
        className="relative flex w-full flex-col transition-all duration-300 ease-out"
        style={{
          paddingBottom: isDocked ? '2rem' : '10rem',
          paddingRight: shouldAdjustLayout ? 'min(500px, 30vw)' : '0',
        }}
      >
        <Header />
        <main className="flex-auto">{children}</main>
        <Footer />
      </div>
    </>
  )
}
