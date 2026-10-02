import { Navbar } from '@/components/navbar'
import { WorkspaceOnboarding } from '@/components/workspace-onboarding'
import type { Metadata } from 'next'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <WorkspaceOnboarding />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
