import type { ApiSpec, AuditLog, FunctionalSpec, IdpState, NotificationLog, SpecVersion } from "../types/specs"
import { cloneState, createClientId, today } from "./idpStore"

export function makeVersion(
  targetType: SpecVersion["targetType"],
  targetId: string,
  version: string,
  summary: string,
  snapshot: unknown
) {
  return {
    id: createClientId("VER"),
    targetType,
    targetId,
    version,
    summary,
    author: "현재 사용자",
    createdAt: today(),
    snapshot: cloneState(snapshot),
  }
}

export function makeLog(channel: NotificationLog["channel"], event: string, message: string): NotificationLog {
  return {
    id: createClientId("LOG"),
    channel,
    event,
    message,
    createdAt: today(),
  }
}

function makeAuditLog(
  action: string,
  targetType: AuditLog["targetType"],
  targetId: string,
  targetTitle: string,
  summary: string,
  metadata: Record<string, unknown> = {}
): AuditLog {
  return {
    id: createClientId("AUD"),
    action,
    targetType,
    targetId,
    targetTitle,
    actor: "현재 사용자",
    actorRole: "협업자",
    createdAt: new Date().toISOString(),
    summary,
    metadata,
  }
}

export function appendAuditLog(
  state: IdpState,
  action: string,
  targetType: AuditLog["targetType"],
  targetId: string,
  targetTitle: string,
  summary: string,
  metadata: Record<string, unknown> = {}
) {
  state.auditLogs = [
    makeAuditLog(action, targetType, targetId, targetTitle, summary, metadata),
    ...state.auditLogs,
  ].slice(0, 200)
}

export function appendEnabledLogs(state: IdpState, event: string, message: string) {
  const logs = state.notificationRules
    .filter(rule => rule.enabled && rule.events.includes(event))
    .map(rule => makeLog(rule.channel, event, `[${rule.target}] ${message}`))

  state.notificationLogs = [...logs, ...state.notificationLogs].slice(0, 30)
}

export function syncFunctionalLinks(state: IdpState, spec: FunctionalSpec) {
  state.apiSpecs = state.apiSpecs.map(api => {
    const shouldLink = spec.linkedApiIds.includes(api.id)
    const hasLink = api.linkedFunctionalIds.includes(spec.id)
    if (shouldLink && !hasLink) {
      return { ...api, linkedFunctionalIds: [...api.linkedFunctionalIds, spec.id] }
    }
    if (!shouldLink && hasLink) {
      return { ...api, linkedFunctionalIds: api.linkedFunctionalIds.filter(id => id !== spec.id) }
    }
    return api
  })
}

export function syncApiLinks(state: IdpState, spec: ApiSpec) {
  state.functionalSpecs = state.functionalSpecs.map(functional => {
    const shouldLink = spec.linkedFunctionalIds.includes(functional.id)
    const hasLink = functional.linkedApiIds.includes(spec.id)
    if (shouldLink && !hasLink) {
      const linkedApiIds = [...functional.linkedApiIds, spec.id]
      return { ...functional, linkedApiIds, linkedApis: linkedApiIds.length }
    }
    if (!shouldLink && hasLink) {
      const linkedApiIds = functional.linkedApiIds.filter(id => id !== spec.id)
      return { ...functional, linkedApiIds, linkedApis: linkedApiIds.length }
    }
    return functional
  })
}
