export type AccountSummary = {
  username: string
  name: string
  role: string
  createdAt: string
}

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? "요청을 처리할 수 없습니다.")
  }

  return data
}

export function getAuthSession() {
  return requestJson<{ authenticated: boolean; configured: boolean }>("/api/auth/session")
}

export function login(username: string, password: string) {
  return requestJson<{ ok: true }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export function getAccounts() {
  return requestJson<{ accounts: AccountSummary[] }>("/api/accounts")
}

export function addAccount(username: string, password: string, name: string, role: string) {
  return requestJson<{ accounts: AccountSummary[] }>("/api/accounts", {
    method: "POST",
    body: JSON.stringify({ username, password, name, role }),
  })
}

export function removeAccount(username: string) {
  return requestJson<{ accounts: AccountSummary[] }>(`/api/accounts/${encodeURIComponent(username)}`, {
    method: "DELETE",
  })
}
