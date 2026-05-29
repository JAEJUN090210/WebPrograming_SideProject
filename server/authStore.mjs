import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const DEFAULT_STORE_PATH = resolve(process.cwd(), ".auth", "accounts.json")
const STORE_PATH = resolve(process.env.WEBPIDP_AUTH_STORE ?? DEFAULT_STORE_PATH)
const ADMIN_USERNAME = process.env.WEBPIDP_ADMIN_USERNAME ?? "admin"
const ADMIN_PASSWORD = process.env.WEBPIDP_ADMIN_PASSWORD
const IS_PRODUCTION = process.env.NODE_ENV === "production"

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex")
  return { salt, hash }
}

function verifyPassword(password, account) {
  const candidate = Buffer.from(hashPassword(password, account.salt).hash, "hex")
  const stored = Buffer.from(account.passwordHash, "hex")

  return candidate.length === stored.length && timingSafeEqual(candidate, stored)
}

function verifyPlainPassword(password, expectedPassword) {
  const candidate = Buffer.from(password)
  const expected = Buffer.from(expectedPassword)

  return candidate.length === expected.length && timingSafeEqual(candidate, expected)
}

function getBootstrapPassword() {
  if (ADMIN_PASSWORD) {
    return ADMIN_PASSWORD
  }

  if (!IS_PRODUCTION) {
    return "admin"
  }

  return null
}

function readStore() {
  if (!existsSync(STORE_PATH)) {
    return { accounts: [] }
  }

  try {
    const data = JSON.parse(readFileSync(STORE_PATH, "utf8"))
    if (!Array.isArray(data.accounts)) {
      return { accounts: [] }
    }

    return {
      accounts: data.accounts.filter(account => account.username !== ADMIN_USERNAME),
    }
  } catch {
    return { accounts: [] }
  }
}

function writeStore(store) {
  mkdirSync(dirname(STORE_PATH), { recursive: true })
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

function sanitizeAccount(account) {
  return {
    username: account.username,
    name: account.name ?? account.username,
    role: account.role ?? "미지정",
    createdAt: account.createdAt,
  }
}

export function isAuthConfigured() {
  return Boolean(getBootstrapPassword() || readStore().accounts.length > 0)
}

export function listAccounts() {
  const accounts = readStore().accounts.map(sanitizeAccount)

  if (!getBootstrapPassword()) {
    return accounts
  }

  return [
    {
      username: ADMIN_USERNAME,
      name: "관리자",
      role: "관리자",
      createdAt: new Date(0).toISOString(),
    },
    ...accounts,
  ]
}

export function addAccount(username, password, name, role) {
  const trimmedUsername = username.trim()
  const trimmedPassword = password.trim()
  const trimmedName = name.trim()
  const trimmedRole = role.trim()

  if (!trimmedUsername || !trimmedPassword || !trimmedName || !trimmedRole) {
    return { ok: false, status: 400, error: "아이디, 비밀번호, 이름, 직군을 모두 입력해 주세요." }
  }

  if (trimmedUsername === ADMIN_USERNAME) {
    return { ok: false, status: 409, error: "이미 존재하는 아이디입니다." }
  }

  const store = readStore()
  if (store.accounts.some(account => account.username === trimmedUsername)) {
    return { ok: false, status: 409, error: "이미 존재하는 아이디입니다." }
  }

  const { salt, hash } = hashPassword(trimmedPassword)
  const nextStore = {
    accounts: [
      ...store.accounts,
      {
        username: trimmedUsername,
        name: trimmedName,
        role: trimmedRole,
        salt,
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        builtIn: false,
      },
    ],
  }

  writeStore(nextStore)
  return { ok: true, accounts: listAccounts() }
}

export function removeAccount(username) {
  if (username === ADMIN_USERNAME) {
    return { ok: false, status: 400, error: "기본 관리자 계정은 삭제할 수 없습니다." }
  }

  const store = readStore()
  const nextAccounts = store.accounts.filter(account => account.username !== username)
  const nextStore = { accounts: nextAccounts }
  writeStore(nextStore)

  return { ok: true, accounts: listAccounts() }
}

export function verifyCredentials(username, password) {
  if (!isAuthConfigured()) {
    return false
  }

  const bootstrapPassword = getBootstrapPassword()
  if (username === ADMIN_USERNAME) {
    return Boolean(bootstrapPassword && verifyPlainPassword(password, bootstrapPassword))
  }

  const store = readStore()
  const account = store.accounts.find(item => item.username === username)
  return Boolean(account && verifyPassword(password, account))
}
