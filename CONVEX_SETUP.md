# Convex 데이터베이스 설정 가이드

스킬 시커 프로젝트는 **Convex**를 데이터베이스로 사용합니다. 이 가이드를 따라 Convex를 설정하세요.

## 📋 Convex란?

Convex는 실시간 동기화를 지원하는 TypeScript 기반 백엔드 플랫폼입니다.
- ✅ 실시간 쿼리 자동 업데이트
- ✅ TypeScript 완벽 지원
- ✅ 로컬 개발 지원
- ✅ 무료 플랜 제공

## 🚀 빠른 설정 (3분)

### 1. 프로젝트 디렉토리 이동
```bash
cd web
```

### 2. Convex 개발 서버 시작
```bash
# bun 사용
bunx convex dev

# 또는 npm 사용
npx convex dev
```

### 3. Convex 계정 생성/로그인
처음 실행 시 브라우저가 자동으로 열립니다:
- **GitHub**, **Google** 또는 **이메일**로 로그인
- 무료 계정 생성 (신용카드 불필요)

### 4. 프로젝트 연결
터미널에서 프로젝트 이름을 입력하라는 메시지가 나오면:
```
? Project name: skill-seeker
```

### 5. 배포 URL 확인
Convex가 자동으로 배포 URL을 생성합니다:
```
✔ Deployed your convex functions!
  URL: https://thankful-dove-123.convex.cloud
```

### 6. .env.local 파일 업데이트
생성된 URL을 `.env.local` 파일에 추가합니다:
```bash
# web/.env.local
NEXT_PUBLIC_CONVEX_URL=https://thankful-dove-123.convex.cloud
```

### 7. 완료!
이제 `bunx convex dev`를 실행 상태로 유지하고, 새 터미널에서 Next.js를 실행하세요:
```bash
# 새 터미널
cd web
npm run dev
```

## 📊 Convex 대시보드

Convex 대시보드에서 데이터를 실시간으로 확인할 수 있습니다:
- URL: https://dashboard.convex.dev
- 테이블 데이터 보기
- 함수 실행 로그
- 성능 모니터링

## 🗂️ 데이터베이스 스키마

프로젝트에는 다음 테이블이 포함됩니다:

### skills 테이블
스킬 정보를 저장합니다:
- `name` - 스킬 이름
- `description` - 설명
- `category` - 카테고리
- `status` - 상태 (pending, processing, completed, failed)
- `downloadUrl` - 다운로드 URL
- `viewCount`, `downloadCount` - 통계

### comments 테이블
스킬 댓글을 저장합니다

### scrapingLogs 테이블
스크래핑 작업 로그를 저장합니다

## 🔍 Convex 함수 사용 예시

### 데이터 조회 (Query)
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// 모든 스킬 조회
const skills = useQuery(api.skills.list);

// 카테고리별 조회
const frontendSkills = useQuery(api.skills.listByCategory, {
  category: "프론트엔드"
});
```

### 데이터 생성/수정 (Mutation)
```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// 새 스킬 생성
const createSkill = useMutation(api.skills.create);

await createSkill({
  name: "React",
  description: "React 프레임워크",
  category: "프론트엔드",
  // ...
});
```

## ❓ 문제 해결

### Convex URL이 작동하지 않는 경우
```bash
# Convex 재시작
bunx convex dev

# .env.local 파일 확인
cat .env.local
```

### "convex is not defined" 에러
```bash
# 의존성 재설치
npm install convex

# 또는 bun 사용시
bun install convex
```

### 테이블이 보이지 않는 경우
`bunx convex dev`를 실행하면 스키마가 자동으로 푸시됩니다.

## 📚 더 알아보기

- [Convex 공식 문서](https://docs.convex.dev/)
- [Convex + Next.js 가이드](https://docs.convex.dev/quickstart/nextjs)
- [Convex React 가이드](https://docs.convex.dev/client/react)

## 🎯 다음 단계

Convex 설정이 완료되었다면:
1. `/skills` - 스킬 게시판 확인
2. `/create` - 새 스킬 생성해보기
3. 대시보드에서 데이터 실시간 확인

즐거운 개발 되세요! 🚀
