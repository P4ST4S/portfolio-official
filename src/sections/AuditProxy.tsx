import { useEffect, useRef, useState } from 'react'
import { mcpAudit } from '../data/content'
import { createRateLimiter, createSigningKey, inspect, sign, verify, type AuditLine, type Decision } from '../lib/audit'
import './AuditProxy.css'

const PRESETS: { tool: string; label: string; args: Record<string, string> }[] = [
  { tool: 'search_docs', label: 'Chercher dans la doc', args: { query: 'procédure KYB pour une SAS' } },
  {
    tool: 'send_email',
    label: 'Envoyer un email',
    args: { to: 'claire.martin@client.fr', body: 'Votre IBAN FR76 3000 6000 0112 3456 7890 189 est validé.' },
  },
  { tool: 'create_ticket', label: 'Créer un ticket', args: { title: 'Rappeler le client', phone: '06 12 34 56 78' } },
  { tool: 'delete_records', label: 'Supprimer des données', args: { table: 'kyc_sessions' } },
]

const DECISION_LABEL: Record<Decision, string> = {
  allow: 'autorisé',
  deny: 'refusé par la policy',
  rate_limited: 'rate limit atteint',
}

interface Entry {
  line: AuditLine
  sig: string
  valid: boolean
}

interface Packet {
  seq: number
  tool: string
  decision: Decision
}

export function AuditProxy() {
  const [key, setKey] = useState<CryptoKey | null>(null)
  const [allowCall] = useState(() => createRateLimiter(3, 10_000))
  const [entries, setEntries] = useState<Entry[]>([])
  const [packets, setPackets] = useState<Packet[]>([])
  const [request, setRequest] = useState<string | null>(null)
  const seqRef = useRef(0)

  useEffect(() => {
    createSigningKey().then(setKey)
  }, [])

  const call = async (preset: (typeof PRESETS)[number]) => {
    if (!key) return
    const seq = ++seqRef.current
    setRequest(
      JSON.stringify(
        { jsonrpc: '2.0', id: seq, method: 'tools/call', params: { name: preset.tool, arguments: preset.args } },
        null,
        2,
      ),
    )

    const line = inspect(seq, preset.tool, preset.args, allowCall)
    const sig = await sign(key, line)
    const valid = await verify(key, line, sig)

    setPackets((current) => [...current, { seq, tool: preset.tool, decision: line.decision }])
    setEntries((current) => [...current, { line, sig, valid }].slice(-6))
  }

  // Edit the newest line without re-signing it, the way an attacker covering their tracks would.
  const tamper = async () => {
    const last = entries.at(-1)
    if (!key || !last) return
    const forged: AuditLine = { ...last.line, decision: last.line.decision === 'allow' ? 'deny' : 'allow' }
    const valid = await verify(key, forged, last.sig)
    setEntries((current) => current.map((e) => (e === last ? { ...e, line: forged, valid } : e)))
  }

  return (
    <section className="section audit" id="mcp-audit" aria-labelledby="audit-title">
      <div className="wrap">
        <h2 className="section-title" id="audit-title">
          mcp-audit
        </h2>
        <p className="section-lead">
          Mon projet open source. Un proxy Go qui se place entre un agent IA et ses outils MCP, sans modifier
          ni l’un ni l’autre, et garde une trace signée de chaque appel. Essayez-le : la démo ci-dessous
          rejoue sa logique dans votre navigateur.
        </p>

        <div className="audit__demo">
          <div className="audit__wire" aria-hidden="true">
            <div className="audit__node">
              <strong>Client MCP</strong>
              <span>Claude, Cursor…</span>
            </div>
            <div className="audit__track">
              {packets.map((p) => (
                <span
                  key={p.seq}
                  className={`audit__packet audit__packet--${p.decision === 'allow' ? 'pass' : 'block'}`}
                  onAnimationEnd={() => setPackets((current) => current.filter((x) => x.seq !== p.seq))}
                >
                  {p.tool}
                </span>
              ))}
              <div className="audit__node audit__node--proxy">
                <strong>mcp-audit</strong>
                <span>redaction, policy, rate limit, HMAC</span>
              </div>
            </div>
            <div className="audit__node">
              <strong>Serveur MCP</strong>
              <span>vos outils</span>
            </div>
          </div>

          <div className="audit__controls">
            <p className="audit__hint">Envoyer un appel d’outil :</p>
            <div className="audit__buttons">
              {PRESETS.map((preset) => (
                <button key={preset.tool} type="button" disabled={!key} onClick={() => call(preset)}>
                  <span className="mono">{preset.tool}</span>
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="audit__rules">
              Règles de la démo : les outils <code>delete_*</code>, <code>drop_*</code> et <code>exec_*</code> sont
              refusés, et chaque outil est limité à 3 appels par tranche de 10 secondes.
            </p>
          </div>

          <div className="audit__panels">
            <figure className="audit__panel">
              <figcaption>Requête reçue par le proxy</figcaption>
              <pre className="mono">{request ?? '// En attente d’un appel'}</pre>
            </figure>

            <figure className="audit__panel">
              <figcaption>
                Journal d’audit signé
                <button type="button" className="audit__tamper" disabled={!entries.length} onClick={tamper}>
                  Falsifier la dernière ligne
                </button>
              </figcaption>
              {entries.length === 0 ? (
                <p className="audit__empty">Chaque appel ajoute ici une ligne, signée avec une clé HMAC-SHA256 générée pour cette page.</p>
              ) : (
                <ol className="audit__log mono" aria-live="polite">
                  {entries.map(({ line, sig, valid }) => (
                    <li key={line.seq} className={`audit__entry audit__entry--${line.decision}${valid ? '' : ' is-forged'}`}>
                      <div className="audit__entry-head">
                        <span>#{line.seq}</span>
                        <span>{line.tool}</span>
                        <span className="audit__decision">{DECISION_LABEL[line.decision]}</span>
                      </div>
                      <div className="audit__args">{JSON.stringify(line.args)}</div>
                      <div className="audit__sig">
                        <span>hmac {sig.slice(0, 24)}…</span>
                        <span className="audit__verdict">{valid ? 'signature valide' : 'signature invalide'}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </figure>
          </div>
        </div>

        <div className="audit__facts">
          <dl className="audit__numbers">
            {mcpAudit.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="audit__text">
            <h3>Dans le vrai projet</h3>
            <ul className="audit__features">
              {mcpAudit.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {mcpAudit.ecosystem.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="btn" href={mcpAudit.repo} target="_blank" rel="noreferrer">
              Voir mcp-audit sur GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
