import { projects, skills } from '../data/content'
import './Projects.css'

export function Projects() {
  return (
    <section className="section projects" id="projets" aria-labelledby="projects-title">
      <div className="wrap">
        <h2 className="section-title" id="projects-title">
          Autres projets
        </h2>
        <p className="section-lead">De la vision par ordinateur au Go bas niveau. Ouvrez une ligne pour le détail.</p>

        <ul className="projects__list">
          {projects.map((project) => (
            <li key={project.name}>
              <details className="project">
                <summary>
                  <span className="project__name">{project.name}</span>
                  <span className="project__pitch">{project.pitch}</span>
                  <span className="project__proof">{project.proof}</span>
                  <span className="project__toggle" aria-hidden="true" />
                </summary>
                <div className="project__body">
                  <p>{project.detail}</p>
                  <ul className="project__stack" aria-label="Technologies">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <div className="project__links">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section className="section skills" aria-labelledby="skills-title">
      <div className="wrap skills__grid">
        <h2 className="section-title" id="skills-title">
          Outils
        </h2>
        <dl className="skills__list">
          {skills.map((skill) => (
            <div key={skill.area}>
              <dt>{skill.area}</dt>
              <dd>{skill.items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
