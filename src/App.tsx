import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ProgramSection } from './components/ProgramSection'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#fefcf1', color: '#383831' }}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ProgramSection />
      </main>
      <Footer />
    </div>
  )
}
