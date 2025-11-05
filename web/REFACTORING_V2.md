# Skill Seeker v2.0 - AI 기반 리팩토링

## 개요

Skill Seeker를 문서 사이트 스크래핑 기반에서 **AI 기반 스킬 생성**으로 완전히 리팩토링했습니다.

### 변경 전 (v1.x)
- 문서 사이트 URL을 입력
- Python 백엔드로 페이지 스크래핑
- 스크래핑한 데이터로 스킬 생성

### 변경 후 (v2.0)
- **프롬프트 입력** 또는 **파일 업로드**로 스킬 생성
- Gemini API를 사용한 AI 기반 자동 생성
- Anthropic 공식 SKILL.md 형식 준수

---

## 주요 변경 사항

### 1. AI 엔진 통합 (Gemini API)

**새 파일: `web/convex/generation.ts`**

두 가지 생성 방식 지원:

#### 프롬프트 기반 생성
```typescript
generateFromPrompt({
  skillId: Id<"skills">,
  prompt: string,
  name: string,
  category: string
})
```

사용자가 원하는 스킬을 자연어로 설명하면 Gemini가 완전한 SKILL.md를 생성합니다.

#### 파일 기반 생성
```typescript
generateFromFile({
  skillId: Id<"skills">,
  storageId: Id<"_storage">,
  fileName: string,
  fileType: string
})
```

사용자가 업로드한 문서(TXT, MD, PDF, DOCX)를 분석하여 스킬을 생성합니다.

### 2. SKILL.md 형식

Anthropic 공식 스킬 형식 준수:

```markdown
---
name: 스킬 이름
description: 스킬 설명
version: 1.0.0
license: MIT
---

# [스킬 이름]

## 개요
...

## 주요 기능
...

## 사용 방법
\`\`\`language
// 코드 예제
\`\`\`
```

### 3. 스킬 생성 UI 리디자인

**파일: `web/app/create/page.tsx`**

- 2가지 생성 모드: 프롬프트 / 파일 업로드
- 카드 선택 UI로 직관적인 UX
- 프롬프트 모드: 큰 텍스트 입력창 (8줄)
- 파일 업로드 모드: 드래그 앤 드롭 지원

### 4. 환경 변수 업데이트

**파일: `web/.env.local.example`**

```bash
# Convex 데이터베이스
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# 필수: Gemini API 키
# https://makersuite.google.com/app/apikey 에서 발급
GEMINI_API_KEY=AIzaSy...
```

### 5. 용어 변경

모든 UI 텍스트를 "스크래핑" → "생성"으로 변경:

- "스크래핑 진행 중" → "AI 생성 진행 중"
- "문서 사이트" → "생성 방법"
- "스크래핑 작업" → "스킬 생성 작업"

### 6. 진행 상황 컴포넌트

**새 파일: `web/components/generation-progress.tsx`**

실시간 생성 진행 상황 표시:
- 0% - 분석 중
- 25% - 생성 중
- 50% - 검증 중
- 75% - 패키징 중
- 100% - 완료

### 7. 홈페이지 업데이트

**파일: `web/app/page.tsx`**

- 히어로 섹션: "AI로 어떤 스킬이든 자동 생성하세요"
- 3단계 프로세스:
  1. 프롬프트 또는 파일
  2. AI 자동 생성
  3. 다운로드 & 사용

---

## 기술 스택

### 프론트엔드
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui 컴포넌트

### 백엔드
- Convex (실시간 데이터베이스)
- Convex Actions (백그라운드 작업)
- Convex Storage (파일 저장소)

### AI
- Google Gemini API (gemini-pro 모델)
- 온도: 0.7
- 최대 토큰: 8192

---

## 데이터베이스 스키마

기존 스키마 유지 (호환성):

```typescript
skills: {
  name: string
  description: string
  category: string
  icon: string
  difficulty: string
  sourceUrl: string  // 이제 "AI 생성" 또는 "파일 업로드"로 표시
  status: "pending" | "processing" | "completed" | "failed"
  progress?: number
  downloadUrl?: string
  fileSize?: number
  viewCount: number
  downloadCount: number
  tags: string[]
  createdAt: number
  updatedAt: number
}
```

---

## 생성 워크플로우

### 프롬프트 기반 생성

1. 사용자가 프롬프트 입력 (예: "React hooks 사용법 가이드")
2. Convex에 스킬 레코드 생성 (status: "pending")
3. `generateFromPrompt` Action 실행
4. Gemini API에 시스템 프롬프트 + 사용자 프롬프트 전송
5. 생성된 SKILL.md 콘텐츠 검증
6. Convex Storage에 저장
7. status: "completed", downloadUrl 업데이트

### 파일 기반 생성

1. 사용자가 파일 업로드
2. Convex Storage에 파일 업로드
3. Convex에 스킬 레코드 생성
4. `generateFromFile` Action 실행
5. Storage에서 파일 다운로드
6. 파일 내용 + 생성 프롬프트를 Gemini API에 전송
7. 생성된 SKILL.md 콘텐츠 저장
8. status: "completed", downloadUrl 업데이트

---

## 실시간 업데이트

Convex의 실시간 동기화 덕분에:
- 생성 진행률이 자동으로 UI에 반영
- 로그가 실시간으로 표시
- 완료 시 즉시 다운로드 가능

---

## API 비용

### Gemini API 가격 (2024년 11월 기준)

**gemini-pro 모델:**
- 입력: $0.00025 / 1K 토큰
- 출력: $0.0005 / 1K 토큰

**예상 비용:**
- 프롬프트 생성: 약 2K 입력 + 4K 출력 = $0.0025 (0.3원)
- 파일 생성: 약 3K 입력 + 4K 출력 = $0.003 (0.36원)

**스킬 1000개 생성 시: 약 $3 (3,600원)**

---

## 사용 방법

### 1. 환경 변수 설정

```bash
cd web
cp .env.local.example .env.local
# .env.local 파일 수정: GEMINI_API_KEY 추가
```

### 2. Gemini API 키 발급

1. https://makersuite.google.com/app/apikey 방문
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. 생성된 키를 `.env.local`에 추가

### 3. 개발 서버 실행

```bash
# Convex 개발 서버
bunx convex dev

# Next.js 개발 서버 (새 터미널)
bun dev
```

### 4. 스킬 생성

1. http://localhost:3000 접속
2. "스킬 생성" 버튼 클릭
3. 프롬프트 또는 파일 업로드 선택
4. 필요한 정보 입력
5. "AI 스킬 생성 시작" 클릭
6. 진행 상황 페이지에서 실시간 확인
7. 완료 후 다운로드

---

## 기존 Python CLI와의 호환성

기존 문서 스크래핑 기능은 Python CLI에 그대로 유지됩니다:

```bash
# 기존 방식 (여전히 작동)
python3 cli/doc_scraper.py --config configs/react.json
```

웹 버전은 새로운 AI 기반 생성 방식만 사용하며, 두 시스템은 독립적으로 작동합니다.

---

## 다음 단계 (TODO)

- [ ] PDF 파일 파싱 개선
- [ ] DOCX 파일 지원 추가
- [ ] 생성된 스킬 미리보기 기능
- [ ] 스킬 편집 기능
- [ ] 사용자 인증 (Clerk)
- [ ] 스킬 평가 및 공유 시스템
- [ ] 다국어 지원 (영어, 일본어)

---

## 문의 및 이슈

GitHub Issues: https://github.com/NewTurn2017/Skill_Seekers/issues
