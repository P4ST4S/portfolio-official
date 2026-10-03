import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Waves } from '../components/Guilloche'
import { mrz } from '../data/content'
import './Chip.css'

const [MRZ_1, MRZ_2] = mrz
// BAC key material: document number, birth date and expiry, each with its check digit.
const MRZ_INFO = MRZ_2.slice(0, 10) + MRZ_2.slice(13, 20) + MRZ_2.slice(21, 28)

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
const randomHex = (length: number) => hex(crypto.getRandomValues(new Uint8Array(length)))

interface LogLine {
  dir?: '→' | '←'
  text: string
  note?: string
  ok?: boolean
}

interface Step {
  title: string
  body: string
  screen: string
  log: LogLine[]
}

const buildSteps = (seed: string, challenge: string, nonce: string): Step[] => [
  {
    title: 'La caméra lit la MRZ',
    body: 'Apple Vision sur iOS, Google ML Kit sur Android. Le numéro du document, la date de naissance et la date d’expiration, vérifiés par leurs chiffres de contrôle, deviennent la clé d’accès à la puce. Sur la carte d’identité française, c’est le CAN à six chiffres qui joue ce rôle.',
    screen: 'Cadrez la bande en bas du document',
    log: [
      { text: '2 lignes OCR-B détectées' },
      { text: `document   ${MRZ_2.slice(0, 9)}`, note: `contrôle ${MRZ_2[9]}`, ok: true },
      { text: `naissance  ${MRZ_2.slice(13, 19)}`, note: `contrôle ${MRZ_2[19]}`, ok: true },
      { text: `expiration ${MRZ_2.slice(21, 27)}`, note: `contrôle ${MRZ_2[27]}`, ok: true },
    ],
  },
  {
    title: 'Un canal chiffré s’ouvre',
    body: 'BAC pour le passeport, PACE pour la carte d’identité. Les clés de session sont dérivées de la MRZ : sans le document physique sous les yeux, la puce refuse de répondre.',
    screen: 'Gardez le téléphone sur la puce',
    log: [
      { text: 'K_seed = SHA-1(MRZ)[0..16]', note: 'calculé ici' },
      { text: seed || '…' },
      { dir: '→', text: '00 A4 04 0C 07 A0 00 00 02 47 10 01', note: 'SELECT eMRTD' },
      { dir: '←', text: '90 00', ok: true },
      { dir: '→', text: '00 84 00 00 08', note: 'GET CHALLENGE' },
      { dir: '←', text: `${challenge} 90 00`, ok: true },
      { dir: '→', text: '00 82 00 00 28 …', note: 'MUTUAL AUTH' },
      { dir: '←', text: '… 90 00', ok: true },
    ],
  },
  {
    title: 'Les données sont lues',
    body: 'DG1 contient l’identité, DG2 la photo du titulaire. Chaque commande APDU est chiffrée et signée, et passe par des bridges Kotlin et Swift vers un cœur en C.',
    screen: 'Lecture des données',
    log: [
      { dir: '→', text: '0C A4 02 0C 15 87 09 01 … 8E 08 … 00', note: 'SELECT DG1' },
      { dir: '←', text: '99 02 90 00 8E 08 … 90 00', ok: true },
      { dir: '→', text: '0C B0 00 00 0D 97 01 DF 8E 08 … 00', note: 'READ BINARY' },
      { dir: '←', text: '87 … 99 02 90 00 8E 08 … 90 00', ok: true },
      { text: 'DG1  identité', ok: true },
      { text: 'DG2  portrait JPEG 2000', ok: true },
    ],
  },
  {
    title: 'La signature de l’État est vérifiée',
    body: 'Authentification passive : le fichier SOD contient l’empreinte de chaque groupe de données, signée par l’autorité émettrice. Un seul octet modifié et la vérification échoue.',
    screen: 'Vérification de la signature',
    log: [
      { dir: '→', text: '0C A4 02 0C 15 87 09 01 … 00', note: 'SELECT SOD' },
      { text: 'SHA-256(DG1) = SOD.hash[1]', ok: true },
      { text: 'SHA-256(DG2) = SOD.hash[2]', ok: true },
      { text: 'signature SOD ← certificat DS ← CSCA', ok: true },
    ],
  },
  {
    title: 'La puce prouve qu’elle n’est pas un clone',
    body: 'Authentification active : la puce signe un défi aléatoire avec une clé privée qu’elle ne révèle jamais. La clé publique correspondante est stockée dans DG15.',
    screen: 'Vérification de la puce',
    log: [
      { dir: '→', text: `0C 88 00 00 … ${nonce} …`, note: 'INTERNAL AUTH' },
      { dir: '←', text: '… signature … 90 00', ok: true },
      { text: 'signature vérifiée avec DG15', ok: true },
    ],
  },
  {
    title: 'Livré en quatre SDK',
    body: 'Flutter, Kotlin, Swift et React Native, pour s’intégrer dans les parcours KYC des clients. En production chez un client majeur, pour plusieurs centaines d’utilisateurs.',
    screen: 'Document vérifié',
    log: [
      { text: 'Android        Kotlin', ok: true },
      { text: 'iOS            Swift', ok: true },
      { text: 'Flutter        plugin', ok: true },
      { text: 'React Native   module', ok: true },
    ],
  },
]

export function Chip() {
  const [active, setActive] = useState(0)
  const [seed, setSeed] = useState('')
  const [challenge] = useState(() => randomHex(8))
  const [nonce] = useState(() => randomHex(8))
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    crypto.subtle
      .digest('SHA-1', new TextEncoder().encode(MRZ_INFO))
      .then((digest) => setSeed(hex(new Uint8Array(digest).slice(0, 16))))
  }, [])

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

  const steps = buildSteps(seed, challenge, nonce)

  return (
    <section className="section nfc" id="nfc" aria-labelledby="nfc-title">
      <div className="wrap">
        <h2 className="section-title" id="nfc-title">
          Lire une puce NFC
        </h2>
        <p className="section-lead">
          Chez Datakeen, j’ai conçu de zéro le SDK mobile qui lit la puce des passeports et des cartes
          d’identité pendant un parcours KYC. Voici ce qui se passe quand on pose le téléphone sur le document.
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
                    style={{ '--p': (active + 1) / steps.length } as CSSProperties}
                  >
                    {active + 1}/{steps.length}
                  </span>
                  <span key={active} className="nfc__screen-text">
                    {steps[active].screen}
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
            {steps.map((step, i) => (
              <li key={step.title} data-step={i} className={i === active ? 'is-active' : undefined}>
                <span className="nfc__num">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <ol className="apdu mono" aria-label="Échanges avec la puce">
                  {step.log.map((line, j) => (
                    <li key={j} style={{ '--j': j } as CSSProperties} className={line.dir ? 'apdu__cmd' : undefined}>
                      <span className="apdu__dir" aria-hidden="true">
                        {line.dir}
                      </span>
                      <span className="apdu__text">{line.text}</span>
                      {line.note && <span className="apdu__note">{line.note}</span>}
                      {line.ok && <span className="apdu__ok">ok</span>}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
