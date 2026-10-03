import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { MarkerCheck, MarkerLoop } from '../components/Marker'
import { mrz, profile } from '../data/content'
import './Hero.css'

const [MRZ_1, MRZ_2] = mrz

// TD3 line 2: document, birth date, expiry, personal number, composite
const CHECK_DIGITS = new Set([9, 19, 27, 42, 43])

const CHECKS = [
  'MRZ lue, 5 chiffres de contrôle valides',
  'Connexion sécurisée à la puce',
  'Données d’identité lues',
  'Portrait lu',
  'Document émis par un État',
  'Puce authentique, pas un clone',
]

// Time spent on each step before moving to the next one (ms).
const STEP_DELAYS = [900, 1500, 420, 420, 420, 420, 420]
const DONE = STEP_DELAYS.length

const YEAR = new Date().getFullYear()

const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Before it is read, the strip is radio static: random MRZ characters.
const MRZ_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<<<<<<<<'
const noise = (length: number) =>
  Array.from({ length }, () => MRZ_ALPHABET[Math.floor(Math.random() * MRZ_ALPHABET.length)]).join('')

function MrzLine({ text, phase, highlight }: { text: string; phase: 'noise' | 'decoding' | 'done'; highlight?: Set<number> }) {
  const [frame, setFrame] = useState(() => noise(text.length))

  useEffect(() => {
    if (phase === 'done') return
    const start = performance.now()
    let last = 0
    let raf = requestAnimationFrame(function tick(now) {
      if (now - last > 45) {
        last = now
        const revealed = phase === 'decoding' ? Math.floor(((now - start) / 1300) * text.length) : 0
        setFrame(text.slice(0, revealed) + noise(Math.max(0, text.length - revealed)))
      }
      raf = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [phase, text])

  if (phase !== 'done') return <span className={`mrz__line${phase === 'noise' ? ' is-static' : ''}`}>{frame}</span>

  let circled = 0
  return (
    <span className="mrz__line">
      {[...text].map((c, i) =>
        highlight?.has(i) ? (
          <mark key={i} className="mrz__check" style={{ '--n': circled++ } as CSSProperties}>
            {c}
            <MarkerLoop seed={i} />
          </mark>
        ) : (
          c
        ),
      )}
    </span>
  )
}

export function Hero() {
  const [step, setStep] = useState(() => (prefersReducedMotion() ? DONE : 0))
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (step >= DONE) return
    const timer = setTimeout(() => setStep((s) => s + 1), STEP_DELAYS[step])
    return () => clearTimeout(timer)
  }, [step])

  // The card tilts under the pointer and the beam of light follows it.
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const card = cardRef.current
    if (!card) return
    const box = card.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
    card.style.setProperty('--ry', `${(x - 0.5) * 12}deg`)
    card.style.setProperty('--rx', `${(0.5 - y) * 8}deg`)
  }

  const untilt = () => {
    const card = cardRef.current
    card?.style.setProperty('--ry', '0deg')
    card?.style.setProperty('--rx', '0deg')
  }

  const mrzPhase = step === 0 ? 'noise' : step === 1 ? 'decoding' : 'done'
  const checksDone = Math.max(0, step - 1)
  const verified = step >= DONE
  const current = step === 0 ? 'Vous examinez le passeport.' : verified ? 'Identité vérifiée.' : CHECKS[Math.min(checksDone, CHECKS.length - 1)]

  return (
    <section className="hero" id="top" data-monologue="Je ne me souviens pas d’être arrivé ici.">
      {/* Letterboxed like a film frame: scene, drifting mist and a figure that comes and goes. */}
      <div className="hero__frame" aria-hidden="true">
        <div className="hero__scene" />
        <svg className="hero__figure" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
          <path d="M1001 542l1.8-14-2.6-10 2.5-.6a3.4 3.9 0 1 1 5.6 0l2.5.6-2.6 10 1.8 14z" />
        </svg>
        <div className="hero__mist hero__mist--far" />
        <div className="hero__mist hero__mist--near" />
        <div className="hero__veil" />
      </div>

      <div className="wrap hero__grid">
        <div className="hero__intro">
          <p className="hero__overline">
            {profile.role} chez {profile.employer}
          </p>
          <h1 className="hero__name" aria-label={`${profile.firstName} ${profile.lastName}`}>
            {[profile.firstName, profile.lastName].map((word, i) => (
              <span key={word} className="hero__line" style={{ '--i': i } as CSSProperties} aria-hidden="true">
                <span className="hero__worn" data-ghost={word.toLowerCase()}>
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__handle">{profile.handle.toLowerCase()}</p>
          <p className="hero__lead">
            Je construis ce qui vérifie : le SDK qui lit la puce de votre passeport, la plateforme KYC qui s’en
            sert, et le proxy open source qui audite chaque appel d’outil de vos agents IA.
          </p>
          <nav className="hero__menu" aria-label="Menu">
            <a className="menu-btn menu-btn--primary" href="#nfc">
              Commencer
            </a>
            <a className="menu-btn" href="#contact">
              Me contacter
            </a>
            <a className="menu-btn" href={profile.github} target="_blank" rel="noreferrer">
              GitHub
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 11l6-6M6 5h5v5" />
              </svg>
            </a>
          </nav>
        </div>

        <div className="hero__doc">
          <p className="examine__label">
            <span>Objet</span> passeport de développeur
          </p>
          <div className="idcard-stage" onPointerMove={tilt} onPointerLeave={untilt}>
            <figure
              ref={cardRef}
              className={`idcard${step === 1 ? ' is-scanning' : ''}${checksDone >= 2 ? ' is-reading' : ''}`}
              aria-label="Page d’identité stylisée, lue comme un vrai passeport"
            >
              <header className="idcard__head">
                <span>Passeport de développeur</span>
                <span className="idcard__type">
                  P <span className="mono">UTO</span>
                </span>
              </header>

              <div className="idcard__body">
                <div className={`idcard__portrait${checksDone >= 4 ? ' is-revealed' : ''}`}>
                  {/* ponytail: hotlinked so it follows the GitHub avatar; copy into public/ if it must work offline */}
                  <img src={`${profile.github}.png?size=240`} alt={`Avatar GitHub de ${profile.handle}`} width="240" height="240" />
                </div>

                <dl className="idcard__fields">
                  <div>
                    <dt>Nom / Surname</dt>
                    <dd>{profile.lastName.toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt>Prénoms / Given names</dt>
                    <dd>{profile.firstName.toUpperCase()}</dd>
                  </div>
                  <div className="idcard__wide">
                    <dt>Profession</dt>
                    <dd>{profile.role}</dd>
                  </div>
                  <div>
                    <dt>Langages / Languages</dt>
                    <dd>{profile.stack}</dd>
                  </div>
                  <div>
                    <dt>Lieu / Place</dt>
                    <dd>{profile.location}</dd>
                  </div>
                  <div className="idcard__wide">
                    <dt>Autorité / Authority</dt>
                    <dd>{profile.employer}</dd>
                  </div>
                </dl>

                <svg className="idcard__chip" viewBox="0 0 40 26" aria-hidden="true">
                  <rect x="1" y="1" width="38" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="8" y="5" width="24" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="20" cy="13" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 13h7M25 13h7" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>

              <p className="idcard__secret hand" aria-hidden="true">
                Vous inspectez les détails. On devrait travailler ensemble.
              </p>

              <div className="mrz mono" aria-hidden="true">
                <MrzLine text={MRZ_1} phase={mrzPhase} />
                <MrzLine text={MRZ_2} phase={mrzPhase} highlight={CHECK_DIGITS} />
              </div>

              <div className="idcard__light" aria-hidden="true" />
              <div className="idcard__scan" aria-hidden="true" />

              {verified && (
                <div className="idcard__verified" aria-hidden="true">
                  <span className="hand">vérifié</span>
                  <MarkerLoop seed={3} />
                </div>
              )}
            </figure>
          </div>

          <div className="examine">
            <p className="examine__now mono">
              <span role="status">{current}</span>
              {!verified && <span className="examine__caret" aria-hidden="true" />}
            </p>
            <ol className="checks">
              {CHECKS.map((check, i) => (
                <li key={check} className={i < checksDone ? 'is-ok' : i === checksDone && step > 0 ? 'is-active' : ''}>
                  <span className="checks__box" aria-hidden="true">
                    {i < checksDone && <MarkerCheck />}
                  </span>
                  {check}
                </li>
              ))}
            </ol>
            <p className="examine__foot">
              Les chiffres de contrôle entourés sont calculés avec l’algorithme ICAO 9303.
              {verified && (
                <button type="button" className="examine__replay" onClick={() => setStep(0)}>
                  Relancer la lecture
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="hero__credits">
        <span>Paris, {YEAR}</span>
        <a className="hero__press" href="#nfc">
          Faites défiler
        </a>
        <span>© Antoine Rospars</span>
      </div>
    </section>
  )
}
