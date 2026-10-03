import { mrz, profile } from '../data/content'
import './Contact.css'

const YEAR = new Date().getFullYear()

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 className="section-title" id="contact-title">
          Contact
        </h2>
        <p className="section-lead">
          Un poste, une mission, ou une question sur MCP et les agents IA : écrivez-moi sur LinkedIn. Tout mon
          code public est sur GitHub.
        </p>
        <ul className="contact__links">
          <li>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <span className="contact__label">LinkedIn</span>
              <span className="contact__handle">antoinerospars</span>
            </a>
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <span className="contact__label">GitHub</span>
              <span className="contact__handle">{profile.handle}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  const band = `${mrz[0]}   ${mrz[1]}   `
  return (
    <footer className="footer">
      <div className="footer__mrz mono" aria-hidden="true">
        <span>{band.repeat(2)}</span>
        <span>{band.repeat(2)}</span>
      </div>
      <div className="wrap footer__row">
        <p className="footer__colophon">
          Construit avec React 19, React Compiler et Vite. Aucune bibliothèque d’animation : CSS scroll-driven
          animations, View Transitions et Web Crypto. Les chiffres de contrôle de la MRZ et les signatures de la
          démo mcp-audit sont calculés dans votre navigateur.
        </p>
        <p>© {YEAR} Antoine Rospars</p>
      </div>
    </footer>
  )
}
