import { useEffect, useRef, type RefObject } from 'react'

interface Mote {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  alpha: number
  phase: number
}

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Ash falls in the fog; in the other world the same motes rise as embers.
function useMotes(canvasRef: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || reducedMotion()) return

    let w = 0
    let h = 0
    let motes: Mote[] = []
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const spawn = (anywhere: boolean, rising: boolean): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : rising ? h + 10 : -10,
      r: 0.5 + Math.random() * (rising ? 1.4 : 1.8),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (0.12 + Math.random() * 0.42) * (rising ? -1 : 1),
      alpha: 0.25 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    })

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (w * h) / 16000))
      const rising = document.documentElement.dataset.theme === 'other'
      motes = Array.from({ length: count }, () => spawn(true, rising))
    }

    const frame = (time: number) => {
      const rising = document.documentElement.dataset.theme === 'other'
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i]
        const goingUp = m.vy < 0
        if (goingUp !== rising) {
          // the world changed under this mote: send it the other way
          m.vy = -m.vy
        }
        m.x += m.vx + Math.sin(time / 1700 + m.phase) * 0.18
        m.y += m.vy
        if (m.y > h + 12 || m.y < -12 || m.x < -12 || m.x > w + 12) motes[i] = spawn(false, rising)
        if (rising) {
          const glow = 0.55 + 0.45 * Math.sin(time / 260 + m.phase * 3)
          ctx.globalAlpha = m.alpha * glow
          ctx.fillStyle = m.r > 1.3 ? '#e0602e' : '#b8401f'
        } else {
          ctx.globalAlpha = m.alpha
          ctx.fillStyle = '#efece6'
        }
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(frame)
    }

    resize()
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [canvasRef])
}

// The flashlight follows the pointer; only drawn in the other world (see .flashlight).
// The position is written on the overlay itself: on :root it would restyle the whole page.
function useFlashlight(lightRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const light = lightRef.current
    if (!light || !matchMedia('(pointer: fine)').matches) return
    let raf = 0
    let x = 0
    let y = 0
    const move = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        light.style.setProperty('--fx', `${x}px`)
        light.style.setProperty('--fy', `${y}px`)
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [lightRef])
}

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)
  useMotes(canvasRef)
  useFlashlight(lightRef)

  return (
    <>
      <div className="atmo" aria-hidden="true">
        <div className="atmo__fog atmo__fog--far" />
        <div className="atmo__fog atmo__fog--near" />
      </div>
      <canvas ref={canvasRef} className="motes" aria-hidden="true" />
      <div className="flashlight" ref={lightRef} aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
