import { useEffect, useRef } from 'react'
import { SectionHead } from '../components/SectionHead'
import { journey } from '../data/content'
import './Journey.css'

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null)

  // A save file "loads" (its red square paints in) the first time it scrolls into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-loaded')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    )
    listRef.current?.querySelectorAll('.save').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const saves = journey.toReversed()

  return (
    <section
      className="section journey"
      id="parcours"
      aria-labelledby="journey-title"
      data-monologue="Je connais ces endroits. J’y ai sauvegardé."
    >
      <div className="wrap">
        <SectionHead id="journey-title" kicker="charger une partie" title="Parcours" />
        <p className="sh-lead">
          Chez Datakeen depuis janvier 2024, du stage au CDI, en parallèle d’un cursus EPITECH passé en partie à Stuttgart.
        </p>

        <ol className="saves" ref={listRef}>
          {saves.map((stop, i) => (
            <li key={stop.title} className="save">
              <div className="save__head">
                <span className="save__square" aria-hidden="true" />
                <span className="save__slot mono">Sauvegarde {String(saves.length - i).padStart(2, '0')}</span>
                <span className="save__location">{stop.location}</span>
                <span className="save__time mono">{stop.saved}</span>
              </div>
              <div className="save__body">
                <p className="save__period">{stop.period}</p>
                <h3>{stop.title}</h3>
                <p className="save__summary">{stop.summary}</p>
                {stop.points.length > 0 && (
                  <ul className="save__points">
                    {stop.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
