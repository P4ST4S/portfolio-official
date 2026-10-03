import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { journey, type Stop } from '../data/content'
import './Journey.css'

const TILTS = [-7, 5, -3, 8, -5]

function Stamp({ stop }: { stop: Stop }) {
  const id = useId()
  const color = `var(--${stop.ink})`

  if (stop.shape === 'circle' || stop.shape === 'oval') {
    const rx = 92
    const ry = stop.shape === 'circle' ? 92 : 64
    const h = ry * 2 + 16
    const cy = h / 2
    // Top text sits outside its path, bottom text inside its path, so they use different radii.
    const top = `M ${100 - rx + 22} ${cy} A ${rx - 22} ${ry - 22} 0 0 1 ${100 + rx - 22} ${cy}`
    const bottom = `M ${100 - rx + 12} ${cy} A ${rx - 12} ${ry - 12} 0 0 0 ${100 + rx - 12} ${cy}`
    return (
      <svg viewBox={`0 0 200 ${h}`} className="stamp__svg" style={{ color }}>
        <ellipse cx="100" cy={cy} rx={rx} ry={ry} fill="none" stroke="currentColor" strokeWidth="5" />
        <ellipse cx="100" cy={cy} rx={rx - 9} ry={ry - 9} fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path id={`${id}t`} d={top} fill="none" />
        <path id={`${id}b`} d={bottom} fill="none" />
        <text className="stamp__arc">
          <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">
            {stop.stampTop}
          </textPath>
        </text>
        <text className="stamp__arc">
          <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">
            {stop.stampBottom}
          </textPath>
        </text>
        <text x="100" y={cy + 9} textAnchor="middle" className="stamp__date">
          {stop.stampDate}
        </text>
        <path d={`M 52 ${cy - 22} H 148 M 52 ${cy + 22} H 148`} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }

  const outline =
    stop.shape === 'rect'
      ? 'M 8 8 H 192 V 132 H 8 Z M 16 16 H 184 V 124 H 16 Z'
      : 'M 52 6 H 148 L 194 46 V 94 L 148 134 H 52 L 6 94 V 46 Z M 56 15 H 144 L 185 50 V 90 L 144 125 H 56 L 15 90 V 50 Z'
  return (
    <svg viewBox="0 0 200 140" className="stamp__svg" style={{ color }}>
      <path d={outline} fill="none" stroke="currentColor" strokeWidth="3" fillRule="evenodd" />
      <text x="100" y="44" textAnchor="middle" className="stamp__arc">
        {stop.stampTop}
      </text>
      <text x="100" y="84" textAnchor="middle" className="stamp__date">
        {stop.stampDate}
      </text>
      <text x="100" y="112" textAnchor="middle" className="stamp__arc">
        {stop.stampBottom}
      </text>
    </svg>
  )
}

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null)

  // Each stamp hits the page once, the first time it scrolls into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-stamped')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    )
    listRef.current?.querySelectorAll('.stamp').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const stops = journey.toReversed()

  return (
    <section className="section journey" id="parcours" aria-labelledby="journey-title">
      <div className="wrap">
        <h2 className="section-title" id="journey-title">
          Parcours
        </h2>
        <p className="section-lead">
          Chez Datakeen depuis janvier 2024, du stage au CDI, en parallèle d’un cursus EPITECH passé en partie à Stuttgart.
        </p>

        <ol className="journey__list" ref={listRef}>
          {stops.map((stop, i) => (
            <li key={stop.title} className="journey__stop">
              <div className="stamp" style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` } as CSSProperties} aria-hidden="true">
                <Stamp stop={stop} />
              </div>
              <div className="journey__text">
                <p className="journey__period">{stop.period}</p>
                <h3>{stop.title}</h3>
                <p className="journey__summary">{stop.summary}</p>
                {stop.points.length > 0 && (
                  <ul className="journey__points">
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
