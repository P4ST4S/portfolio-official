import { Atmosphere } from './components/Atmosphere'
import { Monologue } from './components/Monologue'
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
      {/* Shared filters: worn print for titles, felt-tip for red marker, wet paint for the save square. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="worn" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="8" result="grit" />
          <feColorMatrix in="grit" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.9" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="in" result="eroded" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="2" result="warp" />
          <feDisplacementMap in="eroded" in2="warp" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="marker" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="5" result="fibre" />
          <feDisplacementMap in="SourceGraphic" in2="fibre" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="paint" x="-15%" y="-15%" width="130%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="2" result="wet" />
          <feDisplacementMap in="SourceGraphic" in2="wet" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Atmosphere />
      <Nav />
      <main>
        <Hero />
        <Chip />
        <div className="static" aria-hidden="true" />
        <AuditProxy />
        <Journey />
        <div className="static" aria-hidden="true" />
        <Projects />
        <Skills />
        <div className="static" aria-hidden="true" />
        <Contact />
      </main>
      <Footer />
      <Monologue />
    </>
  )
}
