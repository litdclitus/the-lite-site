import { type Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { ProjectCard } from '@/components/ProjectCard'
import logoConductify from '@/images/logos/conductify.svg'
import aiChatWidget from '@/images/logos/aichat.svg'
import logoSalestify from '@/images/logos/salestify.svg'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'What I’ve Built',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="What I’ve Built"
      intro="A collection of things I've built recently."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        <ProjectCard
          name="Conductify AI - No-code Automation Platform"
          description="An innovative no-code AI sales platform that empowers users to customize and train AI Agents via intuitive drag-and-drop interfaces. Efficiently manages multi-channel integrations and sophisticated knowledge-base data flows."
          logo={logoConductify}
          links={[
            { href: 'https://studio.conductify.ai', label: 'AI Studio' },
          ]}
        />
        <ProjectCard
          name="AI Chat Widget & Standalone Application"
          description="A React-based real-time chat interface enabling seamless conversations with AI agents. Features dual deployment modes: embeddable widget for website integration and standalone web application. Supports markdown rendering, file uploads and conversation history."
          logo={aiChatWidget}
          links={[
            { href: 'https://chat.conductify.ai/embed?agentUuid=60563445-b01b-4f6c-826a-3d6121f35458', label: 'Live Demo' },
          ]}
        />
        <ProjectCard
          name="Salestify AI"
          description="A zero-config, plug-and-play AI sales platform designed for SMBs to automate customer engagement through advanced data extraction. By simply entering a website URL, the system automatically crawls products and knowledge bases to generate a functional AI assistant with an intuitive UI for real-time management and testing."
          logo={logoSalestify}
          links={[
            { href: 'https://salestify.ai', label: 'Visit Website' },
            { href: 'https://app.salestify.ai', label: 'Try Now' },
          ]}
        />
      </ul>
    </SimpleLayout>
  )
}
