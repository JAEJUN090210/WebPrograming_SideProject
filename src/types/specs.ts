export type SpecStatus = "Draft" | "In Review" | "Approved" | "Deprecated"

export type SpecPriority = "Low" | "Medium" | "High" | "Critical"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type AuthType = "None" | "API Key" | "OAuth2" | "JWT"

export type ReviewState = "대기" | "검토 중" | "승인" | "수정 요청"

export type FunctionalSpec = {
  id: string
  title: string
  description: string
  owner: string
  status: SpecStatus
  updatedAt: string
  category: string
  priority: SpecPriority
  version: string
  tags: string[]
  linkedApis: number
  linkedApiIds: string[]
  linkedEntityIds: string[]
  requirements: string[]
  acceptanceCriteria: string[]
  reviewers: string[]
  reviewState: ReviewState
}

export type ApiSpec = {
  id: string
  name: string
  description: string
  owner: string
  status: SpecStatus
  updatedAt: string
  method: HttpMethod
  path: string
  version: string
  tags: string[]
  auth: AuthType
  latencyMs: number
  requestBody: string
  responseBody: string
  linkedFunctionalIds: string[]
  linkedEntityIds: string[]
  reviewers: string[]
  reviewState: ReviewState
}

export type ErdField = {
  name: string
  type: string
  required: boolean
  note: string
}

export type ErdEntity = {
  id: string
  name: string
  description: string
  owner: string
  updatedAt: string
  fields: ErdField[]
}

export type ErdRelationship = {
  id: string
  fromEntityId: string
  toEntityId: string
  label: string
}

export type SpecVersion = {
  id: string
  targetType: "functional" | "api" | "erd"
  targetId: string
  version: string
  summary: string
  author: string
  createdAt: string
  snapshot: unknown
}

export type SpecComment = {
  id: string
  targetType: "functional" | "api" | "erd"
  targetId: string
  author: string
  role: string
  message: string
  createdAt: string
  kind: "comment" | "review" | "change-request"
}

export type NotificationRule = {
  id: string
  channel: "Slack" | "Discord"
  target: string
  webhookUrl: string
  enabled: boolean
  events: string[]
  recipients: NotificationRecipient[]
  messageTemplate: string
  includeSummary: boolean
  includeChangedFields: boolean
  includeAuditLink: boolean
}

export type NotificationLog = {
  id: string
  channel: "Slack" | "Discord"
  event: string
  message: string
  createdAt: string
}

export type NotificationRecipient = {
  id: string
  name: string
  role: string
  contact: string
  enabled: boolean
}

export type AuditLog = {
  id: string
  action: string
  targetType: "functional" | "api" | "erd" | "comment" | "notification" | "account" | "theme"
  targetId: string
  targetTitle: string
  actor: string
  actorRole: string
  createdAt: string
  summary: string
  metadata: Record<string, unknown>
}

export type IdpState = {
  functionalSpecs: FunctionalSpec[]
  apiSpecs: ApiSpec[]
  erdEntities: ErdEntity[]
  erdRelationships: ErdRelationship[]
  versions: SpecVersion[]
  comments: SpecComment[]
  notificationRules: NotificationRule[]
  notificationLogs: NotificationLog[]
  auditLogs: AuditLog[]
}
