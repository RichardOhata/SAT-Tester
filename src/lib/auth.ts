// Holds the admin password for the current browser session. It is sent as the
// `x-admin-password` header on write requests; the server verifies it.
const KEY = 'admin-password'

export function getAdminPassword(): string {
  return sessionStorage.getItem(KEY) ?? ''
}

export function setAdminPassword(password: string): void {
  sessionStorage.setItem(KEY, password)
}

export function clearAdminPassword(): void {
  sessionStorage.removeItem(KEY)
}

/** Headers for admin-only write requests. */
export function adminHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-admin-password': getAdminPassword(),
  }
}
