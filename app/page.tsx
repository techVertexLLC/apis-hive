import { Hero } from '@/components/sections/Hero'
import { LiveActivityPreview } from '@/components/sections/LiveActivityPreview'
import { EmployeePreview } from '@/components/sections/EmployeePreview'
import { CtaFooter } from '@/components/sections/CtaFooter'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <LiveActivityPreview />
      <EmployeePreview />
      <CtaFooter />
    </main>
  )
}
