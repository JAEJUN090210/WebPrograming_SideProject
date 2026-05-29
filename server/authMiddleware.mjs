import { randomBytes } from "node:crypto"
import { addAccount, isAuthConfigured, listAccounts, removeAccount, verifyCredentials } from "./authStore.mjs"

const SESSION_COOKIE = "webpidp.sid"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8
const sessions = new Map()

function sendJson(res, status, payload, headers = {}) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value)
  }
  res.end(JSON.stringify(payload))
}

function parseCookies(req) {
  const header = req.headers.cookie
  if (!header) {
    return {}
  }

  return Object.fromEntries(
    header.split(";").map(cookie => {
      const [name, ...value] = cookie.trim().split("=")
      return [name, decodeURIComponent(value.join("="))]
    }),
  )
}

function getSession(req) {
  const token = parseCookies(req)[SESSION_COOKIE]
  if (!token) {
    return null
  }

  const session = sessions.get(token)
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token)
    return null
  }

  return session
}

function buildCookie(req, token, maxAge = SESSION_MAX_AGE_SECONDS) {
  const forwardedProto = req.headers["x-forwarded-proto"]
  const isSecure = req.socket.encrypted || forwardedProto === "https"
  const parts = [`${SESSION_COOKIE}=${encodeURIComponent(token)}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${maxAge}`]

  if (isSecure) {
    parts.push("Secure")
  }

  return parts.join("; ")
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ""

    req.on("data", chunk => {
      body += chunk
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"))
        req.destroy()
      }
    })
    req.on("end", () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error("Invalid JSON"))
      }
    })
    req.on("error", reject)
  })
}

function requireSession(req, res) {
  const session = getSession(req)
  if (!session) {
    sendJson(res, 401, { error: "로그인이 필요합니다." })
    return null
  }

  return session
}

export function createAuthMiddleware() {
  return async function authMiddleware(req, res, next) {
    const url = new URL(req.url ?? "/", "http://localhost")

    if (!url.pathname.startsWith("/api/auth") && !url.pathname.startsWith("/api/accounts")) {
      next()
      return
    }

    try {
      if (url.pathname === "/api/auth/session" && req.method === "GET") {
        sendJson(res, 200, {
          authenticated: Boolean(getSession(req)),
          configured: isAuthConfigured(),
        })
        return
      }

      if (url.pathname === "/api/auth/login" && req.method === "POST") {
        if (!isAuthConfigured()) {
          sendJson(res, 503, { error: "서버 관리자 계정이 설정되지 않았습니다." })
          return
        }

        const body = await readBody(req)
        const username = typeof body.username === "string" ? body.username : ""
        const password = typeof body.password === "string" ? body.password : ""

        if (!verifyCredentials(username, password)) {
          sendJson(res, 401, { error: "아이디 또는 비밀번호가 올바르지 않습니다." })
          return
        }

        const token = randomBytes(32).toString("base64url")
        sessions.set(token, {
          username,
          expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
        })
        sendJson(res, 200, { ok: true }, { "Set-Cookie": buildCookie(req, token) })
        return
      }

      if (url.pathname === "/api/auth/logout" && req.method === "POST") {
        const token = parseCookies(req)[SESSION_COOKIE]
        if (token) {
          sessions.delete(token)
        }
        sendJson(res, 200, { ok: true }, { "Set-Cookie": buildCookie(req, "", 0) })
        return
      }

      if (url.pathname === "/api/accounts" && req.method === "GET") {
        if (!requireSession(req, res)) {
          return
        }

        sendJson(res, 200, { accounts: listAccounts() })
        return
      }

      if (url.pathname === "/api/accounts" && req.method === "POST") {
        if (!requireSession(req, res)) {
          return
        }

        const body = await readBody(req)
        const result = addAccount(
          typeof body.username === "string" ? body.username : "",
          typeof body.password === "string" ? body.password : "",
          typeof body.name === "string" ? body.name : "",
          typeof body.role === "string" ? body.role : "",
        )

        if (!result.ok) {
          sendJson(res, result.status, { error: result.error })
          return
        }

        sendJson(res, 201, { accounts: result.accounts })
        return
      }

      if (url.pathname.startsWith("/api/accounts/") && req.method === "DELETE") {
        if (!requireSession(req, res)) {
          return
        }

        const username = decodeURIComponent(url.pathname.replace("/api/accounts/", ""))
        const result = removeAccount(username)

        if (!result.ok) {
          sendJson(res, result.status, { error: result.error })
          return
        }

        sendJson(res, 200, { accounts: result.accounts })
        return
      }

      sendJson(res, 404, { error: "Not found" })
    } catch {
      sendJson(res, 400, { error: "요청을 처리할 수 없습니다." })
    }
  }
}
