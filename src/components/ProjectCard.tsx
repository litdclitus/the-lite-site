import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Card } from '@/components/Card'

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export interface ProjectLink {
  href: string
  label: string
}

export interface ProjectCardProps {
  name: string
  description: string
  logo: StaticImageData
  links: ProjectLink[]
}

export function ProjectCard({ name, description, logo, links }: ProjectCardProps) {
  return (
    <Card as="li" className="p-4">
      {/* Fixed background with hover border highlight */}
      <div className="absolute inset-0 z-0 rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 transition group-hover:ring-2 group-hover:ring-teal-500 dark:bg-zinc-800/90 dark:ring-zinc-700/50 dark:group-hover:ring-teal-500" />

      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={logo} alt="" className="h-8 w-8" unoptimized />
      </div>
      <h2 className="relative z-10 mt-6 cursor-default text-base font-semibold text-zinc-800 dark:text-zinc-100">
        {name}
      </h2>
      <p className="relative z-10 mt-2 cursor-default text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={clsx(
            'relative z-10 flex text-sm font-medium transition-all',
            'rounded-md px-2 py-1.5 -mx-2',
            'text-zinc-600 hover:text-teal-600 hover:bg-teal-100/50',
            'dark:text-zinc-300 dark:hover:text-teal-400 dark:hover:bg-teal-950/50',
            index === 0 ? 'mt-6' : 'mt-2'
          )}
        >
          <LinkIcon className="h-6 w-6 flex-none" />
          <span className="ml-2">{link.label}</span>
        </Link>
      ))}
    </Card>
  )
}
