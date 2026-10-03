import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Waves } from '../components/Guilloche'
import { mrz } from '../data/content'
import './Chip.css'

const [MRZ_1, MRZ_2] = mrz

// Told from the user's side on purpose: how the SDK works internally is Datakeen's know-how.
const STEPS = [
  {
    title: 'Scanner le document',
    body: 'L’utilisateur cadre son passeport ou sa carte d’identité. Le SDK le guide jusqu’à une capture exploitable, sans saisie manuelle.',
    screen: 'Cadrez la bande en bas du document',
  },
  {
    title: 'Poser le téléphone sur la puce',
    body: 'La lecture NFC démarre dès que le téléphone touche le document. L’échange avec la puce est chiffré : sans le document physique, rien ne se passe.',
    screen: 'Gardez le téléphone sur la puce',
  },
  {
    title: 'Lire les données de l’État',
    body: 'Identité et photo sont lues directement dans la puce, telles que l’autorité émettrice les a écrites. Pas d’OCR approximatif sur ces données-là.',
    screen: 'Lecture des données',
  },
  {
    title: 'Prouver l’authenticité',
    body: 'Le SDK vérifie que la puce a bien été émise par un État, qu’elle n’a pas été modifiée et qu’il ne s’agit pas d’un clone.',
    screen: 'Vérification du document',
  },
  {
    title: 'Livré en quatre SDK',
    body: 'Flutter, Kotlin, Swift et React Native, pour s’intégrer dans les parcours KYC des clients. En production chez un client majeur, pour plusieurs centaines d’utilisateurs.',
    screen: 'Document vérifié',
  },
]

export function Chip() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-50% 0px -40% 0px' },
    )
    listRef.current?.querySelectorAll('[data-step]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section nfc" id="nfc" aria-labelledby="nfc-title">
      <div className="wrap">
        <h2 className="section-title" id="nfc-title">
          Lire une puce NFC
        </h2>
        <p className="section-lead">
          Chez Datakeen, j’ai conçu de zéro le SDK mobile qui lit la puce des passeports et des cartes
          d’identité pendant un parcours KYC. Voici ce que vit l’utilisateur, du scan à la vérification.
        </p>

        <div className="nfc__layout">
          <div className="nfc__sticky">
            <div className="nfc__stage" data-step={active} aria-hidden="true">
              <div className="nfc__doc">
                <Waves className="nfc__doc-waves" />
                <span className="nfc__doc-title">Passeport</span>
                <svg className="nfc__doc-chip" viewBox="0 0 40 26">
                  <rect x="1" y="1" width="38" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <rect x="8" y="5" width="24" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="20" cy="13" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 13h7M25 13h7" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <div className="nfc__doc-mrz mono">
                  <span>{MRZ_1}</span>
                  <span>{MRZ_2}</span>
                </div>
                <span className="nfc__doc-seal">Vérifié</span>
              </div>

              <div className="nfc__phone">
                <div className="nfc__notch" />
                <div className="nfc__screen">
                  <span
                    className="nfc__ring-progress"
                    style={{ '--p': (active + 1) / STEPS.length } as CSSProperties}
                  >
                    {active + 1}/{STEPS.length}
                  </span>
                  <span key={active} className="nfc__screen-text">
                    {STEPS[active].screen}
                  </span>
                </div>
              </div>

              <span className="nfc__rings">
                <span />
                <span />
                <span />
              </span>

              <ul className="nfc__sdks">
                {['Flutter', 'Kotlin', 'Swift', 'React Native'].map((sdk, i) => (
                  <li key={sdk} style={{ '--i': i } as CSSProperties}>
                    {sdk}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ol className="nfc__steps" ref={listRef}>
            {STEPS.map((step, i) => (
              <li key={step.title} data-step={i} className={i === active ? 'is-active' : undefined}>
                <span className="nfc__num">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
