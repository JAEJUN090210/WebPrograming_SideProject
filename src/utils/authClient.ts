export type AccountSummary = {
  username: string
  name: string
  role: string
  createdAt: string
}

type AccountRecord = AccountSummary & {
  password: string
}

const ACCOUNTS_KEY = "webpidp:accounts:v1"
const SESSION_KEY = "webpidp:session:v1"

const defaultAccounts: AccountRecord[] = [
  {
    username: "admin",
    password: "admin",
    name: "관리자",
    role: "관리자",
    createdAt: "2026-04-08",
  },
]

function loadAccounts(): AccountRecord[] {
  const saved = window.localStorage.getItem(ACCOUNTS_KEY)
  if (!saved) {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(defaultAccounts))
    return defaultAccounts
  }

  try {
    return JSON.parse(saved) as AccountRecord[]
  } catch {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(defaultAccounts))
    return defaultAccounts
  }
}

function saveAccounts(accounts: AccountRecord[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function toSummary(account: AccountRecord): AccountSummary {
  return {
    username: account.username,
    name: account.name,
    role: account.role,
    createdAt: account.createdAt,
  }
}

export async function getAuthSession() {
  const username = window.localStorage.getItem(SESSION_KEY)
  const authenticated = Boolean(username && loadAccounts().some(account => account.username === username))
  return { authenticated, configured: true }
}

export async function login(username: string, password: string) {
  const account = loadAccounts().find(item => item.username === username && item.password === password)
  if (!account) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
  }

  window.localStorage.setItem(SESSION_KEY, account.username)
  return { ok: true as const }
}

export async function logout() {
  window.localStorage.removeItem(SESSION_KEY)
  return { ok: true as const }
}

export async function getAccounts() {
  return { accounts: loadAccounts().map(toSummary) }
}

export async function addAccount(username: string, password: string, name: string, role: string) {
  const trimmedUsername = username.trim()
  const trimmedPassword = password.trim()
  const trimmedName = name.trim()
  const trimmedRole = role.trim()

  if (!trimmedUsername || !trimmedPassword || !trimmedName || !trimmedRole) {
    throw new Error("아이디, 이름, 비밀번호, 직군을 모두 입력해 주세요.")
  }

  const accounts = loadAccounts()
  if (accounts.some(account => account.username === trimmedUsername)) {
    throw new Error("이미 존재하는 아이디입니다.")
  }

  const nextAccounts = [
    ...accounts,
    {
      username: trimmedUsername,
      password: trimmedPassword,
      name: trimmedName,
      role: trimmedRole,
      createdAt: new Date().toISOString(),
    },
  ]
  saveAccounts(nextAccounts)
  return { accounts: nextAccounts.map(toSummary) }
}

export async function removeAccount(username: string) {
  if (username === "admin") {
    throw new Error("admin 계정은 삭제할 수 없습니다.")
  }

  const nextAccounts = loadAccounts().filter(account => account.username !== username)
  saveAccounts(nextAccounts)
  if (window.localStorage.getItem(SESSION_KEY) === username) {
    window.localStorage.removeItem(SESSION_KEY)
  }
  return { accounts: nextAccounts.map(toSummary) }
}
