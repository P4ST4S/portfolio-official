import { useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'

const LINKS = [
  { href: '#nfc', label: 'NFC' },
  { href: '#mcp-audit', label: 'mcp-audit' },
  { href: '#parcours', label: 'Parcours' },
  { href: '#projets', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [uv, setUv] = useState(() => document.documentElement.dataset.theme === 'uv')

  const toggleLamp = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !uv
    const root = document.documentElement
    const box = event.currentTarget.getBoundingClientRect()
    root.style.setProperty('--lamp-x', `${box.left + box.width / 2}px`)
    root.style.setProperty('--lamp-y', `${box.top + box.height / 2}px`)

    const apply = () => {
      root.dataset.theme = next ? 'uv' : 'paper'
      flushSync(() => setUv(next))
    }
    try {
      localStorage.setItem('theme', next ? 'uv' : 'paper')
    } catch {
      // Private mode: the choice just won't survive a reload.
    }

    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#top">
          <svg className="nav__mark" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="2" y="2" width="60" height="60" rx="12" fill="var(--ink)" />
            <circle cx="32" cy="32" r="21" fill="none" stroke="var(--paper)" strokeWidth="1.5" strokeDasharray="2.5 2.5" />
            <text x="32" y="40" textAnchor="middle" fontWeight="800" fontSize="21" fill="var(--paper)">
              AR
            </text>
          </svg>
          Antoine Rospars
        </a>
        <nav aria-label="Sections">
          <ul className="nav__links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="uv-toggle" type="button" aria-pressed={uv} onClick={toggleLamp}>
          <span className="uv-toggle__bulb" aria-hidden="true" />
          <span className="uv-toggle__label">{uv ? 'Éteindre la lampe UV' : 'Lampe UV'}</span>
        </button>
      </div>
    </header>
  )
}
