/** Acesso seguro ao localStorage (pode estar indisponível em modo privado ou bloqueado). */
export function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sem persistência disponível: o carrinho continua funcionando durante a sessão.
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignorado
  }
}
