import { Nav } from './components/Nav'
import { AuditProxy } from './sections/AuditProxy'
import { Chip } from './sections/Chip'
import { Contact, Footer } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Journey } from './sections/Journey'
import { Projects, Skills } from './sections/Projects'

export default function App() {
  return (
    <>
      <div className="progress" aria-hidden="true" />
      {/* Rubber-stamp ink: roughens edges and leaves gaps, shared by every stamp on the page. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="ink">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" result="rough" />
          <feComponentTransfer in="noise" result="holes">
            <feFuncA type="discrete" tableValues="1 1 1 0.15 1" />
          </feComponentTransfer>
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
      </svg>
      <Nav />
      <main>
        <Hero />
        <Chip />
        <AuditProxy />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
