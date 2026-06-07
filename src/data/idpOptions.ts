import type { AuthType, HttpMethod, NotificationRule, ReviewState, SpecPriority, SpecStatus } from "../types/specs"

export const STATUS_OPTIONS: SpecStatus[] = ["Draft", "In Review", "Approved", "Deprecated"]

export const STATUS_LABELS: Record<SpecStatus, string> = {
  Draft: "초안",
  "In Review": "검토 중",
  Approved: "승인됨",
  Deprecated: "사용 중단",
}

export const PRIORITY_OPTIONS: SpecPriority[] = ["Low", "Medium", "High", "Critical"]

export const PRIORITY_LABELS: Record<SpecPriority, string> = {
  Low: "낮음",
  Medium: "보통",
  High: "높음",
  Critical: "긴급",
}

export const REVIEW_STATE_OPTIONS: ReviewState[] = ["대기", "검토 중", "승인", "수정 요청"]

export const METHOD_OPTIONS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"]

export const AUTH_OPTIONS: AuthType[] = ["None", "API Key", "OAuth2", "JWT"]

export const OWNER_OPTIONS = ["전재준", "홍길동", "김기획", "박개발", "이디자인", "최QA", "운영팀"]

export const CATEGORY_OPTIONS = ["기능 명세", "API 명세", "데이터 구조", "협업", "AI 보조", "알림", "온보딩"]

export const NOTIFICATION_CHANNEL_OPTIONS: NotificationRule["channel"][] = ["Slack", "Discord"]

export const NOTIFICATION_EVENT_OPTIONS = ["문서 생성", "문서 수정", "삭제", "복원", "댓글 등록", "검토 요청"]

export const DEFAULT_NOTIFICATION_TEMPLATE = "[IDP] {event}: {targetTitle}"
