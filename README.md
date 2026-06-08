# WebpIdp

WebpIdp는 기능 명세, API 명세, ERD, 리뷰 이력, 알림, 감사 로그를 한곳에서 관리하는 프론트엔드 전용 IDP(Integrated Document Platform) 콘솔입니다. 별도 백엔드 없이 브라우저 `localStorage`에 데이터를 저장하며, 초기 업무 데이터는 비어 있어 사용자가 직접 명세와 규칙을 등록하는 방식으로 동작합니다.

## 주요 기능

- 기능 명세 관리: 요구사항, 인수 조건, 상태, 우선순위, 담당자, 태그, 리뷰어, API/ERD 연결 관리
- API 명세 관리: HTTP 메서드, 경로, 인증 방식, 요청/응답 본문, 기능 명세/ERD 연결 관리
- ERD 관리: 엔티티, 필드, 필수 여부, 관계 정보 등록 및 수정
- 관계/영향도 분석: 기능 명세, API, ERD 간 연결 현황을 영향도 맵으로 확인
- AI 보조: 명세 초안 작성과 문서화 보조 화면 제공
- 댓글/리뷰/버전: 문서별 코멘트, 변경 요청, 버전 스냅샷, 복원 흐름 지원
- 알림 관리: Slack/Discord 규칙, 수신자, 이벤트, 페이로드 옵션, 테스트 로그 관리
- 감사 로그: 문서 생성/수정/삭제, 복원, 알림, 계정 등 주요 변경 이력 추적
- 계정 관리: 로컬 계정 추가/삭제와 프롬프트 기반 로그인
- UI 모드: 라이트/다크 모드 전환 및 PWA 설정

## 기술 스택

- React 19
- TypeScript 6
- Vite 8
- React Router 7
- MUI 9, Emotion
- lucide-react, MUI Icons
- Framer Motion
- vite-plugin-pwa
- Bun

## 시작하기

의존성이 없다면 먼저 설치합니다.

```bash
bun install
```

개발 서버를 실행합니다.

```bash
bun run dev
```

Windows PowerShell에서 실행 정책 때문에 `bun` 명령이 막히면 아래처럼 실행할 수 있습니다.

```bash
bun.cmd run dev
```

기본 로그인 계정은 다음과 같습니다.

```text
ID: admin
PW: admin
```

## 사용 가능한 스크립트

```bash
bun run dev
bun run check-types
bun run lint
bun run build
bun run preview
bun run format
```

- `dev`: Vite 개발 서버 실행
- `check-types`: TypeScript 타입 검사
- `lint`: ESLint 검사
- `build`: 타입 검사 후 프로덕션 빌드 생성
- `preview`: 빌드 결과 미리보기
- `format`: Prettier 포맷팅

## 주요 화면

| 경로                    | 설명                |
| ----------------------- | ------------------- |
| `/`                     | 기능 명세 목록      |
| `/specs/functional`     | 기능 명세 목록      |
| `/specs/functional/new` | 기능 명세 생성      |
| `/specs/functional/:id` | 기능 명세 상세/수정 |
| `/specs/api`            | API 명세 목록       |
| `/specs/api/new`        | API 명세 생성       |
| `/specs/api/:id`        | API 명세 상세/수정  |
| `/erd`                  | ERD 관리            |
| `/impact`               | 관계/영향도 맵      |
| `/ai`                   | AI 보조             |
| `/notifications`        | 알림 규칙/로그 관리 |
| `/audit`                | 감사 로그           |
| `/accounts`             | 계정 관리           |

## 프로젝트 구조

```text
src/
  App.tsx                       라우팅 정의
  main.tsx                      앱 엔트리
  components/
    auth/                       로그인 게이트와 인증 입력 UI
    erd/                        ERD 폼, 관계 폼, 엔티티 그리드
    idp/                        IDP 공통 폼/패널/레이아웃 컴포넌트
    layout/                     공통 헤더, 푸터, 앱 레이아웃
    notifications/              알림 규칙, 수신자, 로그 컴포넌트
    specs/                      명세 목록/카드/테이블 공통 컴포넌트
  data/                         초기 상태와 선택 옵션
  hooks/                        IDP 상태, 인증 폼, 페이지네이션 훅
  pages/                        라우트별 페이지 컴포넌트
  theme/                        라이트/다크 테마 상태
  types/                        명세, ERD, 알림, 감사 로그 타입
  utils/                        로컬 저장소, 인증, 분석, 상태 액션 유틸
```

## 데이터 저장 방식

이 프로젝트는 현재 프론트엔드 전용으로 동작합니다. 서버 API나 데이터베이스 연결 없이 브라우저 `localStorage`에 상태를 보관합니다.

- `webpidp:idp-state:v2`: 기능 명세, API 명세, ERD, 댓글, 버전, 알림, 감사 로그
- `webpidp:accounts:v1`: 로컬 계정 목록
- `webpidp:session:v1`: 현재 로그인 세션

초기 명세/ERD/알림 데이터는 비어 있습니다. 테스트 중 데이터를 초기화하고 싶다면 브라우저 개발자 도구에서 위 키를 삭제한 뒤 새로고침하면 됩니다.

## 개발 메모

- `server` 폴더나 백엔드 미들웨어 없이 동작하는 구조입니다.
- 명세 저장 시 연결 관계, 버전 스냅샷, 알림 로그, 감사 로그가 함께 갱신됩니다.
- PWA 메타데이터는 `vite.config.ts`에서 관리합니다.
- 코드 품질 확인은 `bun.cmd run check-types`, `bun.cmd run lint`, `bun.cmd run build` 순서로 실행하는 것을 권장합니다.
