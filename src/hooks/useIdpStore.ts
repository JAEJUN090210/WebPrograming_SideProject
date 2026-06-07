import { useCallback, useMemo, useState } from "react"
import type {
  ApiSpec,
  AuditLog,
  ErdEntity,
  ErdRelationship,
  FunctionalSpec,
  IdpState,
  NotificationLog,
  NotificationRule,
  SpecComment,
  SpecVersion,
} from "../types/specs"
import {
  cloneState,
  createClientId,
  loadIdpState,
  nextDocumentId,
  nextVersion,
  persistIdpState,
  resetIdpState,
  today,
} from "../utils/idpStore"

function makeVersion(
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

function makeLog(channel: NotificationLog["channel"], event: string, message: string): NotificationLog {
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

function appendAuditLog(
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

function appendEnabledLogs(state: IdpState, event: string, message: string) {
  const logs = state.notificationRules
    .filter(rule => rule.enabled && rule.events.includes(event))
    .map(rule => makeLog(rule.channel, event, `[${rule.target}] ${message}`))

  state.notificationLogs = [...logs, ...state.notificationLogs].slice(0, 30)
}

function syncFunctionalLinks(state: IdpState, spec: FunctionalSpec) {
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

function syncApiLinks(state: IdpState, spec: ApiSpec) {
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

export default function useIdpStore() {
  const [state, setState] = useState<IdpState>(() => loadIdpState())

  const commit = useCallback((next: IdpState) => {
    persistIdpState(next)
    setState(next)
  }, [])

  const owners = useMemo(() => {
    const values = [
      ...state.functionalSpecs.map(spec => spec.owner),
      ...state.apiSpecs.map(spec => spec.owner),
      ...state.erdEntities.map(entity => entity.owner),
    ]
    return Array.from(new Set(values)).sort()
  }, [state.apiSpecs, state.erdEntities, state.functionalSpecs])

  const saveFunctionalSpec = useCallback(
    (input: FunctionalSpec) => {
      const next = cloneState(state)
      const index = next.functionalSpecs.findIndex(spec => spec.id === input.id)
      const existing = index >= 0 ? next.functionalSpecs[index] : null
      const id =
        existing?.id ??
        nextDocumentId(
          "FS",
          next.functionalSpecs.map(spec => spec.id)
        )
      const saved: FunctionalSpec = {
        ...input,
        id,
        linkedApis: input.linkedApiIds.length,
        updatedAt: today(),
        version: existing ? nextVersion(existing.version) : input.version || "0.1",
      }

      if (existing) {
        next.versions = [
          makeVersion("functional", id, existing.version, `${existing.title} 수정 전 버전`, existing),
          ...next.versions,
        ]
        next.functionalSpecs[index] = saved
        appendEnabledLogs(next, "문서 수정", `${saved.id} ${saved.title} 기능 명세가 수정되었습니다.`)
        appendAuditLog(
          next,
          "문서 수정",
          "functional",
          saved.id,
          saved.title,
          "기능 명세 내용과 연결 관계가 수정되었습니다.",
          {
            beforeVersion: existing.version,
            afterVersion: saved.version,
            linkedApiIds: saved.linkedApiIds,
            linkedEntityIds: saved.linkedEntityIds,
          }
        )
      } else {
        next.functionalSpecs = [saved, ...next.functionalSpecs]
        appendEnabledLogs(next, "문서 생성", `${saved.id} ${saved.title} 기능 명세가 생성되었습니다.`)
        appendAuditLog(next, "문서 생성", "functional", saved.id, saved.title, "새 기능 명세가 생성되었습니다.", {
          status: saved.status,
          priority: saved.priority,
          linkedApiIds: saved.linkedApiIds,
        })
      }

      syncFunctionalLinks(next, saved)
      commit(next)
      return id
    },
    [commit, state]
  )

  const deleteFunctionalSpec = useCallback(
    (id: string) => {
      const next = cloneState(state)
      const target = next.functionalSpecs.find(spec => spec.id === id)
      if (!target) {
        return
      }

      next.functionalSpecs = next.functionalSpecs.filter(spec => spec.id !== id)
      next.apiSpecs = next.apiSpecs.map(api => ({
        ...api,
        linkedFunctionalIds: api.linkedFunctionalIds.filter(functionalId => functionalId !== id),
      }))
      next.comments = next.comments.filter(comment => comment.targetId !== id)
      next.versions = [
        makeVersion("functional", id, target.version, `${target.title} 삭제 전 버전`, target),
        ...next.versions,
      ]
      appendEnabledLogs(next, "삭제", `${id} 기능 명세가 삭제되었습니다.`)
      appendAuditLog(
        next,
        "삭제",
        "functional",
        id,
        target.title,
        "기능 명세가 삭제되었고 삭제 전 버전이 저장되었습니다.",
        {
          version: target.version,
        }
      )
      commit(next)
    },
    [commit, state]
  )

  const restoreFunctionalVersion = useCallback(
    (versionId: string) => {
      const version = state.versions.find(item => item.id === versionId && item.targetType === "functional")
      if (!version) {
        return
      }

      const snapshot = version.snapshot as FunctionalSpec
      const next = cloneState(state)
      const index = next.functionalSpecs.findIndex(spec => spec.id === snapshot.id)
      const restored = { ...snapshot, updatedAt: today(), version: nextVersion(snapshot.version) }
      if (index >= 0) {
        next.functionalSpecs[index] = restored
      } else {
        next.functionalSpecs = [restored, ...next.functionalSpecs]
      }
      syncFunctionalLinks(next, restored)
      appendEnabledLogs(next, "복원", `${restored.id} 기능 명세가 ${version.version} 기준으로 복원되었습니다.`)
      appendAuditLog(
        next,
        "복원",
        "functional",
        restored.id,
        restored.title,
        `${version.version} 버전 스냅샷으로 기능 명세를 복원했습니다.`,
        {
          restoredFrom: version.id,
        }
      )
      commit(next)
    },
    [commit, state]
  )

  const saveApiSpec = useCallback(
    (input: ApiSpec) => {
      const next = cloneState(state)
      const index = next.apiSpecs.findIndex(spec => spec.id === input.id)
      const existing = index >= 0 ? next.apiSpecs[index] : null
      const id =
        existing?.id ??
        nextDocumentId(
          "API",
          next.apiSpecs.map(spec => spec.id)
        )
      const saved: ApiSpec = {
        ...input,
        id,
        updatedAt: today(),
        version: existing ? nextVersion(existing.version) : input.version || "0.1",
      }

      if (existing) {
        next.versions = [
          makeVersion("api", id, existing.version, `${existing.name} 수정 전 버전`, existing),
          ...next.versions,
        ]
        next.apiSpecs[index] = saved
        appendEnabledLogs(next, "문서 수정", `${saved.id} ${saved.name} API 명세가 수정되었습니다.`)
        appendAuditLog(
          next,
          "문서 수정",
          "api",
          saved.id,
          saved.name,
          "API 명세의 엔드포인트, 요청/응답 또는 연결 관계가 수정되었습니다.",
          {
            beforeVersion: existing.version,
            afterVersion: saved.version,
            method: saved.method,
            path: saved.path,
          }
        )
      } else {
        next.apiSpecs = [saved, ...next.apiSpecs]
        appendEnabledLogs(next, "문서 생성", `${saved.id} ${saved.name} API 명세가 생성되었습니다.`)
        appendAuditLog(next, "문서 생성", "api", saved.id, saved.name, "새 API 명세가 생성되었습니다.", {
          method: saved.method,
          path: saved.path,
          linkedFunctionalIds: saved.linkedFunctionalIds,
        })
      }

      syncApiLinks(next, saved)
      commit(next)
      return id
    },
    [commit, state]
  )

  const deleteApiSpec = useCallback(
    (id: string) => {
      const next = cloneState(state)
      const target = next.apiSpecs.find(spec => spec.id === id)
      if (!target) {
        return
      }

      next.apiSpecs = next.apiSpecs.filter(spec => spec.id !== id)
      next.functionalSpecs = next.functionalSpecs.map(functional => {
        const linkedApiIds = functional.linkedApiIds.filter(apiId => apiId !== id)
        return { ...functional, linkedApiIds, linkedApis: linkedApiIds.length }
      })
      next.comments = next.comments.filter(comment => comment.targetId !== id)
      next.versions = [makeVersion("api", id, target.version, `${target.name} 삭제 전 버전`, target), ...next.versions]
      appendEnabledLogs(next, "삭제", `${id} API 명세가 삭제되었습니다.`)
      appendAuditLog(next, "삭제", "api", id, target.name, "API 명세가 삭제되었고 삭제 전 버전이 저장되었습니다.", {
        method: target.method,
        path: target.path,
      })
      commit(next)
    },
    [commit, state]
  )

  const restoreApiVersion = useCallback(
    (versionId: string) => {
      const version = state.versions.find(item => item.id === versionId && item.targetType === "api")
      if (!version) {
        return
      }

      const snapshot = version.snapshot as ApiSpec
      const next = cloneState(state)
      const index = next.apiSpecs.findIndex(spec => spec.id === snapshot.id)
      const restored = { ...snapshot, updatedAt: today(), version: nextVersion(snapshot.version) }
      if (index >= 0) {
        next.apiSpecs[index] = restored
      } else {
        next.apiSpecs = [restored, ...next.apiSpecs]
      }
      syncApiLinks(next, restored)
      appendEnabledLogs(next, "복원", `${restored.id} API 명세가 ${version.version} 기준으로 복원되었습니다.`)
      appendAuditLog(
        next,
        "복원",
        "api",
        restored.id,
        restored.name,
        `${version.version} 버전 스냅샷으로 API 명세를 복원했습니다.`,
        {
          restoredFrom: version.id,
        }
      )
      commit(next)
    },
    [commit, state]
  )

  const addComment = useCallback(
    (
      targetType: SpecComment["targetType"],
      targetId: string,
      message: string,
      kind: SpecComment["kind"] = "comment"
    ) => {
      const trimmed = message.trim()
      if (!trimmed) {
        return
      }

      const next = cloneState(state)
      next.comments = [
        {
          id: createClientId("COM"),
          targetType,
          targetId,
          author: "현재 사용자",
          role: "협업자",
          message: trimmed,
          createdAt: today(),
          kind,
        },
        ...next.comments,
      ]
      appendEnabledLogs(next, "댓글 등록", `${targetId} 문서에 새 의견이 등록되었습니다.`)
      appendAuditLog(next, "댓글 등록", "comment", targetId, targetId, "문서에 댓글 또는 리뷰 의견이 등록되었습니다.", {
        kind,
        message: trimmed,
      })
      commit(next)
    },
    [commit, state]
  )

  const saveErdEntity = useCallback(
    (input: ErdEntity) => {
      const next = cloneState(state)
      const id = input.id.trim() || input.name.trim().toLowerCase().replace(/\s+/g, "_")
      const saved = { ...input, id, updatedAt: today() }
      const index = next.erdEntities.findIndex(entity => entity.id === id)

      if (index >= 0) {
        next.erdEntities[index] = saved
        appendEnabledLogs(next, "문서 수정", `${saved.name} ERD 테이블이 수정되었습니다.`)
        appendAuditLog(next, "문서 수정", "erd", saved.id, saved.name, "ERD 테이블 정의가 수정되었습니다.", {
          fields: saved.fields.map(field => field.name),
        })
      } else {
        next.erdEntities = [saved, ...next.erdEntities]
        appendEnabledLogs(next, "문서 생성", `${saved.name} ERD 테이블이 생성되었습니다.`)
        appendAuditLog(next, "문서 생성", "erd", saved.id, saved.name, "새 ERD 테이블이 생성되었습니다.", {
          fields: saved.fields.map(field => field.name),
        })
      }

      commit(next)
    },
    [commit, state]
  )

  const deleteErdEntity = useCallback(
    (id: string) => {
      const next = cloneState(state)
      const target = next.erdEntities.find(entity => entity.id === id)
      if (!target) {
        return
      }

      next.erdEntities = next.erdEntities.filter(entity => entity.id !== id)
      next.erdRelationships = next.erdRelationships.filter(
        relationship => relationship.fromEntityId !== id && relationship.toEntityId !== id
      )
      next.functionalSpecs = next.functionalSpecs.map(spec => ({
        ...spec,
        linkedEntityIds: spec.linkedEntityIds.filter(entityId => entityId !== id),
      }))
      next.apiSpecs = next.apiSpecs.map(spec => ({
        ...spec,
        linkedEntityIds: spec.linkedEntityIds.filter(entityId => entityId !== id),
      }))
      appendEnabledLogs(next, "삭제", `${target.name} ERD 테이블이 삭제되었습니다.`)
      appendAuditLog(next, "삭제", "erd", target.id, target.name, "ERD 테이블과 관련 관계가 삭제되었습니다.", {
        fieldCount: target.fields.length,
      })
      commit(next)
    },
    [commit, state]
  )

  const saveErdRelationship = useCallback(
    (input: ErdRelationship) => {
      const next = cloneState(state)
      const saved = { ...input, id: input.id || createClientId("REL") }
      const index = next.erdRelationships.findIndex(relationship => relationship.id === saved.id)

      if (index >= 0) {
        next.erdRelationships[index] = saved
      } else {
        next.erdRelationships = [...next.erdRelationships, saved]
      }

      appendEnabledLogs(next, "문서 수정", `${saved.label} ERD 관계가 저장되었습니다.`)
      appendAuditLog(next, "문서 수정", "erd", saved.id, saved.label, "ERD 테이블 관계가 저장되었습니다.", {
        fromEntityId: saved.fromEntityId,
        toEntityId: saved.toEntityId,
      })
      commit(next)
    },
    [commit, state]
  )

  const saveErdSnapshot = useCallback(() => {
    const next = cloneState(state)
    next.versions = [
      makeVersion(
        "erd",
        "workspace-erd",
        `1.${next.versions.filter(item => item.targetType === "erd").length}`,
        "ERD 구조 스냅샷 저장",
        {
          entities: next.erdEntities,
          relationships: next.erdRelationships,
        }
      ),
      ...next.versions,
    ]
    appendEnabledLogs(next, "문서 수정", "ERD 구조 스냅샷이 저장되었습니다.")
    appendAuditLog(next, "문서 수정", "erd", "workspace-erd", "ERD 구조", "전체 ERD 구조 스냅샷이 저장되었습니다.", {
      entityCount: next.erdEntities.length,
      relationshipCount: next.erdRelationships.length,
    })
    commit(next)
  }, [commit, state])

  const restoreErdVersion = useCallback(
    (versionId: string) => {
      const version = state.versions.find(item => item.id === versionId && item.targetType === "erd")
      if (!version) {
        return
      }

      const snapshot = version.snapshot as { entities: ErdEntity[]; relationships: ErdRelationship[] }
      const next = cloneState(state)
      next.erdEntities = cloneState(snapshot.entities)
      next.erdRelationships = cloneState(snapshot.relationships)
      appendEnabledLogs(next, "복원", `ERD 구조가 ${version.version} 기준으로 복원되었습니다.`)
      appendAuditLog(
        next,
        "복원",
        "erd",
        "workspace-erd",
        "ERD 구조",
        `${version.version} 버전 스냅샷으로 ERD 구조를 복원했습니다.`,
        {
          restoredFrom: version.id,
        }
      )
      commit(next)
    },
    [commit, state]
  )

  const updateNotificationRule = useCallback(
    (rule: NotificationRule) => {
      const next = cloneState(state)
      const index = next.notificationRules.findIndex(item => item.id === rule.id)
      if (index >= 0) {
        next.notificationRules[index] = rule
      } else {
        next.notificationRules = [rule, ...next.notificationRules]
      }

      appendAuditLog(
        next,
        index >= 0 ? "알림 규칙 수정" : "알림 규칙 생성",
        "notification",
        rule.id,
        rule.channel,
        "알림 채널 설정이 저장되었습니다.",
        {
          target: rule.target,
          recipientCount: rule.recipients.filter(recipient => recipient.enabled).length,
          events: rule.events,
        }
      )
      commit(next)
    },
    [commit, state]
  )

  const deleteNotificationRule = useCallback(
    (id: string) => {
      const next = cloneState(state)
      const target = next.notificationRules.find(rule => rule.id === id)
      if (!target) {
        return
      }

      next.notificationRules = next.notificationRules.filter(rule => rule.id !== id)
      appendAuditLog(
        next,
        "알림 규칙 삭제",
        "notification",
        target.id,
        target.channel,
        "알림 채널 설정이 삭제되었습니다.",
        {
          target: target.target,
          events: target.events,
        }
      )
      commit(next)
    },
    [commit, state]
  )

  const addNotificationLog = useCallback(
    (channel: NotificationLog["channel"], event: string, message: string) => {
      const next = cloneState(state)
      next.notificationLogs = [makeLog(channel, event, message), ...next.notificationLogs].slice(0, 30)
      appendAuditLog(next, "알림 테스트", "notification", channel, channel, "알림 테스트 로그가 생성되었습니다.", {
        event,
        message,
      })
      commit(next)
    },
    [commit, state]
  )

  const addAuditEntry = useCallback(
    (
      action: string,
      targetType: AuditLog["targetType"],
      targetId: string,
      targetTitle: string,
      summary: string,
      metadata: Record<string, unknown> = {}
    ) => {
      const next = cloneState(state)
      appendAuditLog(next, action, targetType, targetId, targetTitle, summary, metadata)
      commit(next)
    },
    [commit, state]
  )

  const reset = useCallback(() => {
    setState(resetIdpState())
  }, [])

  return {
    state,
    owners,
    saveFunctionalSpec,
    deleteFunctionalSpec,
    restoreFunctionalVersion,
    saveApiSpec,
    deleteApiSpec,
    restoreApiVersion,
    addComment,
    saveErdEntity,
    deleteErdEntity,
    saveErdRelationship,
    saveErdSnapshot,
    restoreErdVersion,
    updateNotificationRule,
    deleteNotificationRule,
    addNotificationLog,
    addAuditEntry,
    reset,
  }
}
