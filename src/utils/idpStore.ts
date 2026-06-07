import { seedIdpState } from "../data/idpSeed"
import { DEFAULT_NOTIFICATION_TEMPLATE } from "../data/idpOptions"
import type { IdpState, NotificationRule } from "../types/specs"

const STORAGE_KEY = "webpidp:idp-state:v2"

export function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function createClientId(prefix: string) {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}-${randomPart.toUpperCase()}`
}

export function nextDocumentId(prefix: string, ids: string[]) {
  const nextNumber =
    ids
      .map(id => Number(id.replace(`${prefix}-`, "")))
      .filter(Number.isFinite)
      .reduce((max, value) => Math.max(max, value), 0) + 1

  return `${prefix}-${String(nextNumber).padStart(4, "0")}`
}

export function nextVersion(version: string) {
  const [major = "0", minor = "0"] = version.split(".")
  return `${Number(major)}.${Number(minor) + 1}`
}

export function splitList(value: string) {
  return value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
}

function normalizeState(value: Partial<IdpState> | null): IdpState {
  const notificationRules = (value?.notificationRules ?? []).map(
    (rule): NotificationRule => ({
      ...rule,
      webhookUrl: rule.webhookUrl ?? "",
      recipients: rule.recipients ?? [],
      messageTemplate: rule.messageTemplate ?? DEFAULT_NOTIFICATION_TEMPLATE,
      includeSummary: rule.includeSummary ?? true,
      includeChangedFields: rule.includeChangedFields ?? true,
      includeAuditLink: rule.includeAuditLink ?? true,
    })
  )

  return {
    functionalSpecs: value?.functionalSpecs ?? seedIdpState.functionalSpecs,
    apiSpecs: value?.apiSpecs ?? seedIdpState.apiSpecs,
    erdEntities: value?.erdEntities ?? seedIdpState.erdEntities,
    erdRelationships: value?.erdRelationships ?? seedIdpState.erdRelationships,
    versions: value?.versions ?? seedIdpState.versions,
    comments: value?.comments ?? seedIdpState.comments,
    notificationRules,
    notificationLogs: value?.notificationLogs ?? seedIdpState.notificationLogs,
    auditLogs: value?.auditLogs ?? seedIdpState.auditLogs,
  }
}

export function loadIdpState(): IdpState {
  if (typeof window === "undefined") {
    return cloneState(seedIdpState)
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) {
    const seeded = cloneState(seedIdpState)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }

  try {
    return normalizeState(JSON.parse(saved) as Partial<IdpState>)
  } catch {
    const seeded = cloneState(seedIdpState)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
}

export function persistIdpState(state: IdpState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

export function resetIdpState() {
  const state = cloneState(seedIdpState)
  persistIdpState(state)
  return state
}
