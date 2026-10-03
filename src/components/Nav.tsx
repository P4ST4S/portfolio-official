import { useEffect, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { setDanger, siren, startRadio, stopRadio } from '../lib/radio'

const LINKS = [
  { href: '#nfc', label: 'NFC' },
  { href: '#mcp-audit', label: 'mcp-audit' },
  { href: '#parcours', label: 'Parcours' },
  { href: '#projets', label: 'Projets' },
  { href: '#contact', label: 'Contact' },
]

// The radio crackles harder while the pointer (or focus) is on anything marked data-danger.
function useDangerSense(listening: boolean) {
  useEffect(() => {
    if (!listening) return
    const near = (target: EventTarget | null) => target instanceof Element && target.closest('[data-danger]') !== null
    const enter = (event: Event) => {
      if (near(event.target)) setDanger(1)
    }
    const leave = (event: Event) => {
      const next = (event as PointerEvent | FocusEvent).relatedTarget
      if (near(event.target) && !near(next)) setDanger(0)
    }
    document.addEventListener('pointerover', enter)
    document.addEventListener('pointerout', leave)
    document.addEventListener('focusin', enter)
    document.addEventListener('focusout', leave)
    return () => {
      document.removeEventListener('pointerover', enter)
      document.removeEventListener('pointerout', leave)
      document.removeEventListener('focusin', enter)
      document.removeEventListener('focusout', leave)
      setDanger(0)
    }
  }, [listening])
}

export function Nav() {
  const [other, setOther] = useState(() => document.documentElement.dataset.theme === 'other')
  const [radio, setRadio] = useState(false)
  useDangerSense(radio)

  const toggleWorld = (event: MouseEvent<HTMLButtonElement>) => {
    const next = !other
    const root = document.documentElement
    const box = event.currentTarget.getBoundingClientRect()
    root.style.setProperty('--siren-x', `${box.left + box.width / 2}px`)
    root.style.setProperty('--siren-y', `${box.top + box.height / 2}px`)

    const apply = () => {
      root.dataset.theme = next ? 'other' : 'fog'
      flushSync(() => setOther(next))
    }
    try {
      localStorage.setItem('theme', next ? 'other' : 'fog')
    } catch {
      // Private mode: the choice just won't survive a reload.
    }
    if (next) siren()

    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }

  const toggleRadio = async () => {
    if (radio) await stopRadio()
    else await startRadio()
    setRadio(!radio)
  }

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#top">
          <svg className="nav__mark" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="6" y="6" width="52" height="52" fill="var(--red)" transform="rotate(-2 32 32)" />
            <path d="M14 58v5M40 58v3M51 58v6" stroke="var(--red)" strokeWidth="3" strokeLinecap="round" />
            <text
              x="32"
              y="41"
              textAnchor="middle"
              fontFamily="IM Fell English, Georgia, serif"
              fontSize="24"
              fill="#efe8dc"
            >
              AR
            </text>
          </svg>
          <span className="nav__name">Antoine Rospars</span>
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
        <div className="nav__toggles">
          <button className="toggle toggle--radio" type="button" aria-pressed={radio} onClick={toggleRadio}>
            <span className="toggle__led" aria-hidden="true" />
            <svg className="toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="8" width="18" height="13" rx="1.5" />
              <path d="M7 8l9-5" />
              <circle cx="9" cy="14.5" r="3" />
              <path d="M15 12h3M15 15h3M15 18h3" />
            </svg>
            <span className="toggle__label">Radio</span>
          </button>
          <button className="toggle toggle--siren" type="button" aria-pressed={other} onClick={toggleWorld}>
            <svg className="toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 18v-5a6 6 0 0 1 12 0v5" />
              <path d="M4 18h16v3H4z" />
              <path d="M12 3V1M4.5 6 3 4.5M19.5 6 21 4.5" />
            </svg>
            <span className="toggle__label">Autre monde</span>
          </button>
        </div>
      </div>
    </header>
  )
}
