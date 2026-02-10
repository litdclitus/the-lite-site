import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import ChatWidget from '@/components/ChatWidget'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - litdclitus',
    default:
      'litdclitus - Tech enthusiast',
  },
  description:
    "I'm Lit, a software enthusiast. I'm currently working on a few side projects and building my own SaaS business.",
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
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
          <div className="flex w-full pb-32">
            <Layout>{children}</Layout>
          </div>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
