import type { ApiSpec, FunctionalSpec, IdpState } from "../types/specs"

export type InsightItem = {
  title: string
  detail: string
  severity: "good" | "warning" | "danger"
}

export function getFunctionalInsights(spec: FunctionalSpec, state: IdpState): InsightItem[] {
  const insights: InsightItem[] = []

  if (spec.requirements.length === 0) {
    insights.push({
      title: "요구사항 누락",
      detail: "기능 명세에 최소 1개 이상의 요구사항이 필요합니다.",
      severity: "danger",
    })
  }

  if (spec.acceptanceCriteria.length === 0) {
    insights.push({
      title: "검증 기준 필요",
      detail: "테스트 단계에서 사용할 인수 조건을 추가하면 문서 품질이 높아집니다.",
      severity: "warning",
    })
  }

  if (spec.linkedApiIds.length === 0) {
    insights.push({
      title: "API 연결 없음",
      detail: "기능과 API가 분리되어 있어 구현 영향도 추적이 어렵습니다.",
      severity: "warning",
    })
  }

  if (spec.linkedEntityIds.length === 0) {
    insights.push({
      title: "데이터 구조 연결 없음",
      detail: "디자인과 개발 흐름을 위해 관련 ERD 테이블을 연결하세요.",
      severity: "warning",
    })
  }

  const duplicateTags = spec.tags.filter((tag, index) => spec.tags.indexOf(tag) !== index)
  if (duplicateTags.length > 0) {
    insights.push({
      title: "중복 태그 감지",
      detail: `${Array.from(new Set(duplicateTags)).join(", ")} 태그가 중복되어 있습니다.`,
      severity: "warning",
    })
  }

  const linkedApis = state.apiSpecs.filter(api => spec.linkedApiIds.includes(api.id))
  const deprecatedApis = linkedApis.filter(api => api.status === "Deprecated")
  if (deprecatedApis.length > 0) {
    insights.push({
      title: "사용 중단 API 연결",
      detail: `${deprecatedApis.map(api => api.id).join(", ")} API 상태를 확인해야 합니다.`,
      severity: "danger",
    })
  }

  if (insights.length === 0) {
    insights.push({
      title: "문서 품질 양호",
      detail: "요구사항, 검증 기준, 연결 관계가 균형 있게 작성되어 있습니다.",
      severity: "good",
    })
  }

  return insights
}

export function getApiInsights(spec: ApiSpec): InsightItem[] {
  const insights: InsightItem[] = []

  if (!spec.path.startsWith("/")) {
    insights.push({
      title: "경로 형식 확인",
      detail: "API 경로는 / 문자로 시작해야 합니다.",
      severity: "danger",
    })
  }

  if (spec.requestBody.trim().length === 0) {
    insights.push({
      title: "요청 예시 누락",
      detail: "요청 바디가 없는 API도 빈 객체 예시를 남기면 검토가 쉬워집니다.",
      severity: "warning",
    })
  }

  if (spec.responseBody.trim().length === 0) {
    insights.push({
      title: "응답 예시 누락",
      detail: "프론트엔드와 QA가 참고할 수 있는 응답 예시를 추가하세요.",
      severity: "warning",
    })
  }

  if (spec.linkedFunctionalIds.length === 0) {
    insights.push({
      title: "기능 연결 없음",
      detail: "API가 어떤 기능을 구현하는지 연결하면 문서 간 불일치를 줄일 수 있습니다.",
      severity: "warning",
    })
  }

  if (spec.latencyMs > 250) {
    insights.push({
      title: "응답 시간 예산 확인",
      detail: "예상 응답 시간이 높습니다. 성능 예산 또는 캐시 정책을 검토하세요.",
      severity: "warning",
    })
  }

  if (insights.length === 0) {
    insights.push({
      title: "API 명세 품질 양호",
      detail: "요청/응답, 연결 기능, 기본 성능 기준이 모두 작성되어 있습니다.",
      severity: "good",
    })
  }

  return insights
}

export function recommendApiLinks(spec: FunctionalSpec, state: IdpState) {
  const tags = new Set(spec.tags.map(tag => tag.toLowerCase()))
  return state.apiSpecs
    .filter(api => !spec.linkedApiIds.includes(api.id))
    .map(api => ({
      api,
      score: api.tags.filter(tag => tags.has(tag.toLowerCase())).length,
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
}

export function getImpactSummary(targetId: string, state: IdpState) {
  const functional = state.functionalSpecs.filter(
    spec =>
      spec.id === targetId ||
      spec.linkedApiIds.includes(targetId) ||
      spec.linkedEntityIds.includes(targetId) ||
      state.apiSpecs.some(api => api.id === targetId && api.linkedFunctionalIds.includes(spec.id))
  )

  const apis = state.apiSpecs.filter(
    api =>
      api.id === targetId ||
      api.linkedFunctionalIds.includes(targetId) ||
      api.linkedEntityIds.includes(targetId) ||
      functional.some(spec => spec.linkedApiIds.includes(api.id))
  )

  const entities = state.erdEntities.filter(
    entity =>
      entity.id === targetId ||
      functional.some(spec => spec.linkedEntityIds.includes(entity.id)) ||
      apis.some(api => api.linkedEntityIds.includes(entity.id))
  )

  return { functional, apis, entities }
}

export function createFunctionalDraftFromPrompt(prompt: string): FunctionalSpec {
  const title = prompt.trim() || "새 기능 명세"
  return {
    id: "",
    title,
    description: `${title} 기능의 목적, 사용자 흐름, 입력값과 출력값을 구조화하여 관리한다.`,
    owner: "전재준",
    status: "Draft",
    updatedAt: "",
    category: "AI 보조",
    priority: "Medium",
    version: "0.1",
    tags: ["ai", "draft"],
    linkedApis: 0,
    linkedApiIds: [],
    linkedEntityIds: [],
    requirements: [`${title}의 필수 입력값과 결과를 정의한다.`, "변경 시 관련 문서에 알림을 남긴다."],
    acceptanceCriteria: ["필수 항목을 입력하면 저장할 수 있다.", "상세 화면에서 댓글과 리뷰를 등록할 수 있다."],
    reviewers: ["김기획"],
    reviewState: "대기",
  }
}

export function createApiDraftFromPrompt(prompt: string): ApiSpec {
  const title = prompt.trim() || "새 API 명세"
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "")

  return {
    id: "",
    name: title,
    description: `${title} 기능을 제공하기 위한 API 명세 초안이다.`,
    owner: "전재준",
    status: "Draft",
    updatedAt: "",
    method: "POST",
    path: `/api/${slug || "draft"}`,
    version: "0.1",
    tags: ["ai", "api"],
    auth: "JWT",
    latencyMs: 180,
    requestBody: '{ "title": "string" }',
    responseBody: '{ "ok": true }',
    linkedFunctionalIds: [],
    linkedEntityIds: [],
    reviewers: ["박개발"],
    reviewState: "대기",
  }
}
