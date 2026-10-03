// Run: pnpm check
import assert from 'node:assert/strict'
import { buildTd3, checkDigit } from '../src/lib/mrz.ts'
import { createRateLimiter, createSigningKey, evaluatePolicy, inspect, redact, sign, verify } from '../src/lib/audit.ts'

// ICAO 9303 part 4 specimen
assert.equal(checkDigit('L898902C3'), 6)
assert.equal(checkDigit('740812'), 2)
assert.equal(checkDigit('ZE184226B<<<<<'), 1)
const [l1, l2] = buildTd3({
  issuer: 'UTO',
  surname: 'Eriksson',
  givenNames: 'Anna María',
  documentNumber: 'L898902C3',
  nationality: 'UTO',
  birthDate: '740812',
  sex: 'F',
  expiryDate: '120415',
  personalNumber: 'ZE184226B',
})
assert.equal(l1, 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<')
assert.equal(l2, 'L898902C36UTO7408122F1204159ZE184226B<<<<<10')

const { value, kinds } = redact('IBAN FR76 3000 6000 0112 3456 7890 189, tel 06 12 34 56 78, a@b.fr')
assert.deepEqual(kinds, ['email', 'iban', 'phone'])
assert.equal(value, 'IBAN [REDACTED:iban], tel [REDACTED:phone], [REDACTED:email]')

assert.equal(evaluatePolicy('delete_records'), 'deny')
assert.equal(evaluatePolicy('search_docs'), 'allow')

const allow = createRateLimiter(2, 1000)
assert.deepEqual([allow('t', 0), allow('t', 10), allow('t', 20), allow('t', 1015)], [true, true, false, true])

// A denied tool must not consume rate-limit quota.
const quota = createRateLimiter(1, 1000)
assert.equal(inspect(1, 'delete_x', {}, quota).decision, 'deny')
assert.equal(inspect(2, 'delete_x', {}, quota).decision, 'deny')
assert.equal(inspect(3, 'send', { to: 'a@b.fr' }, quota).decision, 'allow')
assert.deepEqual(inspect(4, 'send', { to: 'a@b.fr' }, quota).redacted, ['email'])
assert.equal(inspect(5, 'send', {}, quota).decision, 'rate_limited')

const key = await createSigningKey()
const line = { seq: 1, ts: 'now', tool: 'x', args: {}, redacted: [], decision: 'deny' as const }
const sig = await sign(key, line)
assert.ok(await verify(key, line, sig))
assert.ok(!(await verify(key, { ...line, decision: 'allow' }, sig)))

console.log('ok')
