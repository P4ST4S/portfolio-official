import { SectionHead } from '../components/SectionHead'
import { mrz, profile } from '../data/content'
import './Contact.css'

const YEAR = new Date().getFullYear()

// A save point: a red square painted on the wall, and two ways to leave a message.
export function Contact() {
  return (
    <section
      className="section save-point"
      id="contact"
      aria-labelledby="contact-title"
      data-monologue="Un carré rouge sur le mur. Je devrais m’arrêter ici."
    >
      <div className="wrap save-point__grid">
        <div className="save-point__wall" aria-hidden="true">
          <span className="save-point__square" />
        </div>
        <div>
          <SectionHead id="contact-title" kicker="point de sauvegarde" title="Contact" />
          <p className="save-point__box mono">Un carré rouge est peint sur le mur. Voulez-vous sauvegarder ?</p>
          <p className="sh-lead">
            Un poste, une mission, ou une question sur MCP et les agents IA : écrivez-moi sur LinkedIn. Tout mon
            code public est sur GitHub.
          </p>
          <ul className="save-point__links">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <span className="save-point__label">LinkedIn</span>
                <span className="save-point__handle">antoinerospars</span>
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <span className="save-point__label">GitHub</span>
                <span className="save-point__handle">{profile.handle}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

// End credits on black, like the bars the page opened with.
export function Footer() {
  const band = `${mrz[0]}   ${mrz[1]}   `
  return (
    <footer className="footer">
      <div className="footer__mrz mono" aria-hidden="true">
        <span>{band.repeat(2)}</span>
        <span>{band.repeat(2)}</span>
      </div>
      <div className="wrap footer__end">
        <p className="footer__fin">Fin</p>
        <p className="footer__ending">ending : leave</p>
      </div>
      <div className="wrap footer__row">
        <p className="footer__colophon">
          Construit avec React 19, React Compiler et Vite. Aucune bibliothèque d’animation : CSS scroll-driven
          animations, View Transitions, Canvas, et Web Audio pour la radio. Les chiffres de contrôle de la MRZ et
          les signatures de la démo mcp-audit sont calculés dans votre navigateur. Hommage non officiel à Silent
          Hill 2 et Silent Hill Townfall (Konami) : aucun élément des jeux n’est réutilisé, tout est dessiné en
          SVG et en CSS.
        </p>
        <p>© {YEAR} Antoine Rospars</p>
      </div>
    </footer>
  )
}
