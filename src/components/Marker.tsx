// Red marker on paper, the way James annotates his map: loops that overshoot,
// checks, strikes. Paths are generated once from a seed so they never look stamped.

const random = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const loopPath = (seed: number) => {
  const r = random(seed)
  const start = -2.5 + r() * 0.6
  const steps = 48
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = start + (Math.PI * 2 + 0.5) * (i / steps)
    const wobble = 1 + 0.04 * Math.sin(3 * t + r() * 0.3) + 0.05 * (i / steps)
    d += `${i ? 'L' : 'M'}${(50 + 46 * wobble * Math.cos(t)).toFixed(1)} ${(50 + 44 * wobble * Math.sin(t)).toFixed(1)}`
  }
  return d
}

const LOOPS = [1, 2, 3, 4, 5, 6].map(loopPath)

interface MarkProps {
  className?: string
  seed?: number
}

export function MarkerLoop({ className = '', seed = 0 }: MarkProps) {
  return (
    <svg className={`marker ${className}`} viewBox="-6 -6 112 112" preserveAspectRatio="none" aria-hidden="true">
      <path d={LOOPS[seed % LOOPS.length]} pathLength={1} />
    </svg>
  )
}

export function MarkerCheck({ className = '' }: MarkProps) {
  return (
    <svg className={`marker ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M10 55 Q22 64 36 84 Q55 40 94 10" pathLength={1} />
    </svg>
  )
}

export function MarkerStrike({ className = '' }: MarkProps) {
  return (
    <svg className={`marker ${className}`} viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
      <path d="M1 12 Q20 6 38 11 T72 9 T99 8" pathLength={1} />
    </svg>
  )
}

export function MarkerUnderline({ className = '' }: MarkProps) {
  return (
    <svg className={`marker ${className}`} viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 8 Q30 3 60 6 T98 4" pathLength={1} />
    </svg>
  )
}
