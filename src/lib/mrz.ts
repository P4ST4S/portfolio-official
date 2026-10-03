// ICAO Doc 9303 machine-readable zone, TD3 format (passport): 2 lines × 44 chars.

const WEIGHTS = [7, 3, 1]

const charValue = (c: string) => {
  if (c === '<') return 0
  const code = c.charCodeAt(0)
  // 0-9 → 0-9, A-Z → 10-35
  return code <= 57 ? code - 48 : code - 55
}

export const checkDigit = (field: string) =>
  [...field].reduce((sum, c, i) => sum + charValue(c) * WEIGHTS[i % 3], 0) % 10

const pad = (s: string, length: number) => s.padEnd(length, '<').slice(0, length)

const fillerize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '<')

export interface Td3Data {
  issuer: string
  surname: string
  givenNames: string
  documentNumber: string
  nationality: string
  birthDate: string // YYMMDD
  sex: 'M' | 'F' | '<'
  expiryDate: string // YYMMDD
  personalNumber: string
}

export const buildTd3 = (d: Td3Data): [string, string] => {
  const line1 = pad(`P<${d.issuer}${fillerize(d.surname)}<<${fillerize(d.givenNames)}`, 44)

  const doc = pad(fillerize(d.documentNumber), 9)
  const personal = pad(fillerize(d.personalNumber), 14)
  const docField = doc + checkDigit(doc)
  const birthField = d.birthDate + checkDigit(d.birthDate)
  const expiryField = d.expiryDate + checkDigit(d.expiryDate)
  const personalField = personal + checkDigit(personal)
  const composite = checkDigit(docField + birthField + expiryField + personalField)

  const line2 = docField + d.nationality + birthField + d.sex + expiryField + personalField + composite
  return [line1, line2]
}
