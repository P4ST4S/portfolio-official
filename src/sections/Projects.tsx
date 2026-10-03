import { useRef, useState, type KeyboardEvent } from 'react'
import { MarkerUnderline } from '../components/Marker'
import { SectionHead } from '../components/SectionHead'
import { projects, skills, type Skill } from '../data/content'
import './Projects.css'

// The memo screen: titles on the left, the selected one read on paper.
export function Projects() {
  const [current, setCurrent] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)
  const project = projects[current]

  const select = (index: number) => {
    const next = (index + projects.length) % projects.length
    setCurrent(next)
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowDown: current + 1,
      ArrowRight: current + 1,
      ArrowUp: current - 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: projects.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    select(moves[event.key])
  }

  return (
    <section
      className="section memos"
      id="projets"
      aria-labelledby="projects-title"
      data-monologue="Des mémos, éparpillés partout. Tous de ma main."
    >
      <div className="wrap">
        <SectionHead id="projects-title" kicker="mémos trouvés" title="Autres projets" />
        <p className="sh-lead">De la vision par ordinateur au Go bas niveau. Choisissez un mémo pour le lire.</p>

        <div className="memos__layout">
          <div className="memos__index" role="tablist" aria-label="Projets" aria-orientation="vertical" ref={tabsRef} onKeyDown={onKey}>
            <p className="memos__count mono" aria-hidden="true">
              Mémos {String(current + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
            </p>
            {projects.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                id={`memo-tab-${i}`}
                aria-selected={i === current}
                aria-controls="memo-panel"
                tabIndex={i === current ? 0 : -1}
                onClick={() => setCurrent(i)}
              >
                <span className="memos__name">{p.name}</span>
                <span className="memos__pitch">{p.pitch}</span>
              </button>
            ))}
          </div>

          <article className="memo" id="memo-panel" role="tabpanel" aria-labelledby={`memo-tab-${current}`} key={project.name}>
            <svg className="memo__clip" viewBox="0 0 40 92" aria-hidden="true">
              <path d="M10 84V16a10 10 0 0 1 20 0v66a14 14 0 0 1-28 0V24" />
            </svg>
            <p className="memo__found">mémo trouvé · {project.name}</p>
            <h3 className="memo__title">{project.name}</h3>
            <p className="memo__pitch">{project.pitch}</p>
            <p className="memo__proof hand">
              {project.proof}
              <MarkerUnderline />
            </p>
            <p className="memo__detail">{project.detail}</p>
            <ul className="memo__stack" aria-label="Technologies">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <div className="memo__links">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function ItemIcon({ icon }: { icon: Skill['icon'] }) {
  const paths: Record<Skill['icon'], string> = {
    pipe: 'M5 20 17 8M15.5 6.5l3 3M3.5 18.5l3 3M17 8l1.5-1.5',
    radio: 'M3 9h18v12H3zM7 9l9-5M9 15a2.6 2.6 0 1 0 0 .1M15 13h3M15 16h3M15 19h3',
    flashlight: 'M9 3h6l-1 7h-4zM10 10h4v11h-4zM12 13v2M5 2l3 2M19 2l-3 2M12 0v2',
    keys: 'M8 9a4 4 0 1 0 0 .1M11 11l9 9M17 17l2-2M15 15l2-2M6 13l-3 8M5 18l-2-1',
    map: 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15M5 12l3-2 4 3 4-2 3 2',
    lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v2.5',
    letter: 'M3 6h18v13H3zM3 6l9 7 9-7M3 19l7-6M21 19l-7-6',
  }
  return (
    <svg className="item__icon" viewBox="-1 -1 26 26" aria-hidden="true">
      <path d={paths[icon]} />
    </svg>
  )
}

// The item screen. Each area of the stack is an object in the inventory.
export function Skills() {
  return (
    <section className="section items" id="outils" aria-labelledby="skills-title" data-monologue="Je n’ai pas grand-chose. Ça devrait suffire.">
      <div className="wrap">
        <div className="items__screen">
          <header className="items__head">
            <div>
              <p className="items__kicker">objets trouvés en chemin</p>
              <h2 className="items__title" id="skills-title">
                Outils
              </h2>
            </div>
            <div className="items__status" aria-hidden="true">
              <span className="items__portrait" />
              <span>
                <small>état</small>
                <strong>prudence</strong>
              </span>
            </div>
          </header>

          <ul className="items__grid">
            {skills.map((skill) => (
              <li key={skill.area} className="item">
                <ItemIcon icon={skill.icon} />
                <div>
                  <p className="item__object">{skill.item}</p>
                  <h3 className="item__area">{skill.area}</h3>
                  <p className="item__list">{skill.items}</p>
                  <p className="item__note">{skill.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="items__cmd" aria-hidden="true">
            utiliser · examiner · combiner
          </p>
        </div>
      </div>
    </section>
  )
}
