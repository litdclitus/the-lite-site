import { type Metadata, type Viewport } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import ChatWidget from '@/components/ChatWidget'
import { ChatProvider } from '@/contexts/ChatContext'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - litdclitus',
    default: 'litdclitus - Tech enthusiast',
  },
  description:
    "I'm Lit, a software enthusiast. I'm currently working on a few side projects and building my own SaaS business.",
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <ChatProvider>
            <Layout>{children}</Layout>
            <ChatWidget />
          </ChatProvider>
        </Providers>
      </body>
    </html>
  )
}
