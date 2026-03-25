import Nav from '@/components/nav'
import Hero from '@/components/hero'
import ProofBar from '@/components/proof-bar'
import GeoSelector from '@/components/geo-selector'
import Differentiators from '@/components/differentiators'
import CompetitiveTable from '@/components/competitive-table'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ProofBar />
      <GeoSelector />
      <Differentiators />
      <CompetitiveTable />
      <Footer />
    </main>
  )
}
