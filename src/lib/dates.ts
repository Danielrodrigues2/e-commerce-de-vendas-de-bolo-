/** Datas trafegam no formato ISO local "AAAA-MM-DD" (mesmo formato do <input type="date">). */

const pad = (n: number) => String(n).padStart(2, '0')

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y!, m! - 1, d! + days)
  return toISODate(date)
}

export function isValidISODate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y!, m! - 1, d!)
  return date.getFullYear() === y && date.getMonth() === m! - 1 && date.getDate() === d
}

/** "2026-10-15" => "15/10/2026" */
export function formatDateBR(iso: string): string {
  if (!isValidISODate(iso)) return iso
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
