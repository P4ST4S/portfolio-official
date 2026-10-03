// The pocket radio: band-passed white noise that gets louder near anything dangerous,
// and the siren when the world changes. Nothing plays until the visitor turns it on.

let ctx: AudioContext | null = null
let hiss: GainNode | null = null
let danger = 0
let crackleTimer = 0

const BASE = 0.012
const NEAR = 0.075

const noiseBuffer = (audio: AudioContext) => {
  const buffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

const level = () => BASE + danger * NEAR

// Short bursts on top of the hiss, more frequent the closer the danger.
const crackle = () => {
  if (!ctx || !hiss) return
  const now = ctx.currentTime
  const peak = level() * (1.6 + Math.random() * 2.2)
  hiss.gain.cancelScheduledValues(now)
  hiss.gain.setValueAtTime(peak, now)
  hiss.gain.linearRampToValueAtTime(level(), now + 0.05 + Math.random() * 0.12)
  const wait = danger > 0 ? 60 + Math.random() * 180 : 900 + Math.random() * 2600
  crackleTimer = window.setTimeout(crackle, wait)
}

export const radioOn = () => ctx !== null

export const startRadio = async () => {
  if (ctx) return
  ctx = new AudioContext()
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx)
  source.loop = true
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1700
  band.Q.value = 0.6
  hiss = ctx.createGain()
  hiss.gain.value = 0
  source.connect(band).connect(hiss).connect(ctx.destination)
  source.start()
  hiss.gain.linearRampToValueAtTime(level(), ctx.currentTime + 0.4)
  crackle()
}

export const stopRadio = async () => {
  window.clearTimeout(crackleTimer)
  const closing = ctx
  ctx = null
  hiss = null
  await closing?.close()
}

export const setDanger = (value: number) => {
  danger = value
  if (!ctx || !hiss) return
  window.clearTimeout(crackleTimer)
  hiss.gain.setTargetAtTime(level(), ctx.currentTime, 0.08)
  crackle()
}

// Two slow rises and falls, like the one that turns the town inside out.
export const siren = () => {
  if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(260, now)
  osc.frequency.linearRampToValueAtTime(620, now + 1.1)
  osc.frequency.linearRampToValueAtTime(300, now + 2)
  osc.frequency.linearRampToValueAtTime(640, now + 3.1)
  osc.frequency.linearRampToValueAtTime(220, now + 4.2)
  const low = ctx.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.value = 1400
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.05, now + 0.4)
  gain.gain.setValueAtTime(0.05, now + 3.6)
  gain.gain.linearRampToValueAtTime(0, now + 4.2)
  osc.connect(low).connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 4.3)
}
