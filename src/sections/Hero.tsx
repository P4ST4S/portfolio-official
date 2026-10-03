import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Rosette, Waves } from '../components/Guilloche'
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
const STEP_DELAYS = [700, 1500, 420, 420, 420, 420, 420]
const DONE = STEP_DELAYS.length

const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

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

  if (phase !== 'done') return <span className="mrz__line">{frame}</span>

  return (
    <span className="mrz__line">
      {[...text].map((c, i) =>
        highlight?.has(i) ? (
          <mark key={i} className="mrz__check" style={{ '--i': i } as CSSProperties}>
            {c}
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

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const card = cardRef.current
    if (!card) return
    const box = card.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
    card.style.setProperty('--ry', `${(x - 0.5) * 14}deg`)
    card.style.setProperty('--rx', `${(0.5 - y) * 10}deg`)
  }

  const untilt = () => {
    const card = cardRef.current
    card?.style.setProperty('--ry', '0deg')
    card?.style.setProperty('--rx', '0deg')
  }

  const mrzPhase = step === 0 ? 'noise' : step === 1 ? 'decoding' : 'done'
  const checksDone = Math.max(0, step - 1)
  const verified = step >= DONE

  return (
    <section className="hero" id="top">
      <Rosette className="hero__rosette" />

      <div className="wrap hero__grid">
        <h1 className="hero__name" aria-label={`${profile.firstName} ${profile.lastName}`}>
          {[profile.firstName, profile.lastName].map((word, w) => (
            <span key={word} className="hero__word" aria-hidden="true">
              {[...word].map((letter, i) => (
                <span key={i} className="hero__letter" style={{ '--i': w * 7 + i } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="hero__copy">
          <p className="hero__role">
            {profile.role} chez {profile.employer}
          </p>
          <p className="hero__lead">
            Je construis ce qui vérifie : le SDK qui lit la puce de votre passeport, la plateforme KYC qui
            s’en sert, et le proxy open source qui audite chaque appel d’outil de vos agents IA.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#contact">
              Me contacter
            </a>
            <a className="btn btn--ghost" href={profile.github} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div className="hero__doc">
          <div className="idcard-stage" onPointerMove={tilt} onPointerLeave={untilt}>
            <figure
              ref={cardRef}
              className={`idcard${step === 1 ? ' is-scanning' : ''}${checksDone >= 2 ? ' is-reading' : ''}`}
              aria-label="Page d’identité stylisée, lue comme un vrai passeport"
            >
              <Waves className="idcard__waves" />
              <div className="idcard__holo" aria-hidden="true" />

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
                  <Rosette className="idcard__portrait-rosette" />
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

              <p className="idcard__uv uv-ink" aria-hidden="true">
                Vous inspectez les détails. On devrait travailler ensemble.
              </p>

              <div className="mrz mono" aria-hidden="true">
                <MrzLine text={MRZ_1} phase={mrzPhase} />
                <MrzLine text={MRZ_2} phase={mrzPhase} highlight={CHECK_DIGITS} />
              </div>

              <div className="idcard__scan" aria-hidden="true" />

              <div className={`stamp-verified${verified ? ' is-down' : ''}`} aria-hidden="true">
                <span>Vérifié</span>
                <small className="mono">ICAO 9303</small>
              </div>
            </figure>
          </div>

          <div className="checks">
            <ol className="checks__list">
              {CHECKS.map((check, i) => (
                <li key={check} className={i < checksDone ? 'is-ok' : i === checksDone && step > 0 ? 'is-active' : ''}>
                  {check}
                  <span className="checks__state" aria-hidden="true" />
                </li>
              ))}
            </ol>
            <p className="checks__foot">
              <span role="status">{verified ? 'Identité vérifiée.' : 'Lecture en cours…'}</span>{' '}
              Les chiffres de contrôle colorés sont calculés avec l’algorithme ICAO 9303.
              {verified && (
                <button type="button" className="checks__replay" onClick={() => setStep(0)}>
                  Relancer la lecture
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
