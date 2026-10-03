// Browser-side model of what mcp-audit does to each MCP tool call:
// redact PII, evaluate an allow/deny policy, rate-limit per tool, sign the audit line.

export type Decision = 'allow' | 'deny' | 'rate_limited'

export interface AuditLine {
  seq: number
  ts: string
  tool: string
  args: Record<string, string>
  redacted: string[]
  decision: Decision
}

const PII: { kind: string; re: RegExp }[] = [
  { kind: 'email', re: /[\w.+-]+@[\w-]+\.[\w.]+/g },
  // IBAN before phone: an IBAN's digit groups would otherwise look like a phone number
  { kind: 'iban', re: /\b[A-Z]{2}\d{2}(?:\s?[\dA-Z]{4}){4,7}(?:\s?[\dA-Z]{1,3})?\b/g },
  { kind: 'phone', re: /(?:\+33\s?|\b0)[1-9](?:[\s.-]?\d{2}){4}\b/g },
]

export const redact = (value: string) => {
  const kinds: string[] = []
  const clean = PII.reduce((text, { kind, re }) => {
    return text.replace(re, () => {
      kinds.push(kind)
      return `[REDACTED:${kind}]`
    })
  }, value)
  return { value: clean, kinds }
}

const DENIED_TOOLS = [/^delete_/, /^drop_/, /^exec_/]

export const evaluatePolicy = (tool: string): 'allow' | 'deny' =>
  DENIED_TOOLS.some((re) => re.test(tool)) ? 'deny' : 'allow'

// ponytail: sliding-window log per tool, fine for a demo; token bucket if it ever sees real traffic
export const createRateLimiter = (limit: number, windowMs: number) => {
  const hits = new Map<string, number[]>()
  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    const allowed = recent.length < limit
    if (allowed) recent.push(now)
    hits.set(key, recent)
    return allowed
  }
}

// One pass of the proxy over a tool call: the policy is checked before the rate limit,
// so a denied tool never consumes quota.
export const inspect = (
  seq: number,
  tool: string,
  rawArgs: Record<string, string>,
  allowCall: (tool: string) => boolean,
): AuditLine => {
  const redacted: string[] = []
  const args = Object.fromEntries(
    Object.entries(rawArgs).map(([name, value]) => {
      const result = redact(value)
      redacted.push(...result.kinds)
      return [name, result.value]
    }),
  )
  const decision: Decision = evaluatePolicy(tool) === 'deny' ? 'deny' : allowCall(tool) ? 'allow' : 'rate_limited'
  return { seq, ts: new Date().toISOString(), tool, args, redacted, decision }
}

const encoder = new TextEncoder()

export const createSigningKey = () =>
  crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g) ?? [], (h) => parseInt(h, 16))

export const serialize = (line: AuditLine) => JSON.stringify(line)

export const sign = async (key: CryptoKey, line: AuditLine) =>
  toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(serialize(line))))

export const verify = (key: CryptoKey, line: AuditLine, sigHex: string) =>
  crypto.subtle.verify('HMAC', key, fromHex(sigHex), encoder.encode(serialize(line)))
