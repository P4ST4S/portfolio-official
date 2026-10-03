// Guilloché: the interlaced engraved lines printed on passports and banknotes.
// Many copies of one oscillating curve, each phase-shifted, weave the mesh.

const TAU = Math.PI * 2

const polar = (base: number, amp: number, lobes: number, phase: number, steps = 480) => {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU
    const r = base + amp * Math.sin(lobes * t + phase)
    d += `${i ? 'L' : 'M'}${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`
  }
  return d
}

const wave = (y0: number, width: number, phase: number) => {
  let d = ''
  for (let x = 0; x <= width; x += 4) {
    const y = y0 + 7 * Math.sin((x / 90) * TAU + phase) + 3 * Math.sin((x / 37) * TAU - phase * 2)
    d += `${x ? 'L' : 'M'}${x} ${y.toFixed(2)}`
  }
  return d
}

const ROSETTE_OUTER = Array.from({ length: 22 }, (_, i) => polar(118, 20, 14, (i / 22) * TAU))
const ROSETTE_INNER = Array.from({ length: 16 }, (_, i) => polar(66, 16, 9, (i / 16) * TAU))
const WAVES = Array.from({ length: 34 }, (_, i) => wave(i * 12, 640, i * 0.35))

export function Rosette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-150 -150 300 300" aria-hidden="true" fill="none">
      <g stroke="var(--guil-a)" strokeWidth="0.5">
        {ROSETTE_OUTER.map((d) => (
          <path key={d} d={d} pathLength={1} />
        ))}
      </g>
      <g stroke="var(--guil-b)" strokeWidth="0.5">
        {ROSETTE_INNER.map((d) => (
          <path key={d} d={d} pathLength={1} />
        ))}
      </g>
    </svg>
  )
}

export function Waves({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 -10 640 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">
      {WAVES.map((d, i) => (
        <path key={d} d={d} stroke={i % 2 ? 'var(--guil-a)' : 'var(--guil-b)'} strokeWidth="0.6" />
      ))}
    </svg>
  )
}
