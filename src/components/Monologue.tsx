import { useEffect, useState } from 'react'

// Simon's thoughts in Townfall are plain text at the bottom of the screen.
// Each section carries its own line in data-monologue; it shows once, when first entered.
export function Monologue() {
  const [line, setLine] = useState('')
  const [on, setOn] = useState(false)

  useEffect(() => {
    let hide = 0
    const seen = new WeakSet<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue
          seen.add(entry.target)
          setLine((entry.target as HTMLElement).dataset.monologue ?? '')
          setOn(true)
          window.clearTimeout(hide)
          hide = window.setTimeout(() => setOn(false), 4200)
        }
      },
      // fires when the section reaches the middle of the screen, whatever its height
      { rootMargin: '0px 0px -50% 0px' },
    )
    document.querySelectorAll('[data-monologue]').forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      window.clearTimeout(hide)
    }
  }, [])

  return (
    <p className={`monologue${on ? ' is-on' : ''}`} aria-hidden="true">
      {line}
    </p>
  )
}
