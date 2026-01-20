import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m litdclitus. I live in Ho Chi Minh City, Vietnam, where I work.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-teal-400/20 to-blue-500/20 blur-2xl dark:from-teal-500/10 dark:to-blue-600/10" />
              <Image
                src={portraitImage}
                alt="Portrait of Lit"
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="relative aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover shadow-lg ring-1 ring-zinc-900/5 transition hover:rotate-0 dark:bg-zinc-800 dark:ring-white/10"
              />
            </div>
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <div className="relative">
            <div className="absolute -left-4 top-0 h-24 w-1 rounded-full bg-gradient-to-b from-teal-500 to-blue-500 dark:from-teal-400 dark:to-blue-400" />
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              I&apos;m Lit
            </h1>
          </div>
          <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
            A tech enthusiast who happens to live in
              Ho Chi Minh City, Vietnam.
          </p>
          <div className="mt-8 space-y-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            <p>
              I don&apos;t just code; I turn caffeine, bad puns, and too many open tabs into digital things that (usually) don&apos;t break in production.
            </p>
            <p>
              Right now I&apos;m having way too much fun building fast, smooth experiences.
            </p>
            <p>
              My current obsessions include making interfaces feel magical and backends behave like grown-ups – all while pretending sub-100ms latency is a basic human right.
            </p>
            <p className="italic">
              I&apos;m convinced the web can be way cooler than it currently is, and I&apos;m quietly (okay, not so quietly) plotting to help make that happen.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list" className="space-y-4">
            <SocialLink href="https://x.com/litdclitus" icon={XIcon}>
              Follow on X
            </SocialLink>
            <SocialLink
              href="https://github.com/litdclitus"
              icon={GitHubIcon}
            >
              Follow on GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/litdclitus/"
              icon={LinkedInIcon}
            >
              Follow on LinkedIn
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
