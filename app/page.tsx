import { Hero } from '@/components/sections/Hero'
import { LiveActivity } from '@/components/sections/LiveActivity'
import { HiveRoster } from '@/components/sections/HiveRoster'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { BusinessLines } from '@/components/sections/BusinessLines'
import { Architects } from '@/components/sections/Architects'
import { CtaFooter } from '@/components/sections/CtaFooter'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <LiveActivity />
      <HiveRoster />
      <HowItWorks />
      <BusinessLines />
      <Architects />
      <CtaFooter />
    </main>
  )
}
