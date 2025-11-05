# 스킬 시커 (Skill Seeker) - 한국어 버전 🇰🇷

> **Next.js + FastAPI 기반으로 완전히 재구현된 한국어 친화적 버전**

문서 사이트를 클릭 몇 번으로 Claude AI 스킬로 자동 변환하세요!

## 🎯 한국어 버전의 특징

- ✅ **완전한 한국어 UI** - 모든 인터페이스가 한국어로 제공
- ✅ **초보자 친화적** - 복잡한 CLI 없이 웹에서 클릭만으로 완성
- ✅ **실제 활용 예제 10개** - 바로 사용 가능한 한국 개발자에게 유용한 스킬들
- ✅ **모던 기술 스택** - Next.js 14 + FastAPI로 빠르고 안정적
- ✅ **실시간 진행상황** - WebSocket으로 스크래핑 진행률 실시간 확인

## 🚀 빠른 시작 (3분 안에!)

### 1. 프로젝트 클론
```bash
git clone https://github.com/NewTurn2017/Skill_Seekers.git
cd Skill_Seekers
```

### 2. 백엔드 실행 (FastAPI)
```bash
# Python 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 백엔드 의존성 설치
pip install -r backend/requirements.txt

# FastAPI 서버 실행
python backend/app/main.py
```

서버가 http://localhost:8000 에서 실행됩니다.

### 3. 프론트엔드 실행 (Next.js)
```bash
# 새 터미널 열기
cd web

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

웹사이트가 http://localhost:3000 에서 실행됩니다!

## 📱 사용 방법

### 방법 1: 웹 UI 사용 (추천!)
1. 브라우저에서 http://localhost:3000 접속
2. 원하는 프리셋 선택 또는 직접 URL 입력
3. "스킬 생성" 버튼 클릭
4. 완료될 때까지 대기 (실시간 진행률 표시)
5. 생성된 `.zip` 파일을 Claude AI에 업로드

### 방법 2: 기존 CLI 사용
```bash
# 가상환경 활성화 필수!
source venv/bin/activate

# Godot 스킬 생성
python3 cli/doc_scraper.py --config configs/godot.json

# React 스킬 생성
python3 cli/doc_scraper.py --config configs/react.json
```

## 🎨 실제 활용 가능한 스킬 10개

웹 UI에서 클릭 한 번으로 바로 생성 가능!

| 아이콘 | 스킬 | 카테고리 | 난이도 | 설명 |
|:---:|------|----------|:------:|------|
| ⚛️ | **React** | 프론트엔드 | 쉬움 | 최신 React 문서로 컴포넌트 개발 스킬 |
| ▲ | **Next.js** | 풀스택 | 보통 | Next.js 풀스택 프레임워크 완전 가이드 |
| ⚡ | **FastAPI** | 백엔드 | 쉬움 | FastAPI로 빠른 API 개발 스킬 |
| 🎸 | **Django** | 백엔드 | 보통 | Django 웹 프레임워크 전체 문서 |
| 🎨 | **Tailwind CSS** | CSS/디자인 | 쉬움 | 유틸리티 클래스로 빠른 스타일링 |
| 🎮 | **Godot** | 게임개발 | 보통 | Godot 게임엔진 완전 가이드 |
| 💚 | **Vue.js** | 프론트엔드 | 쉬움 | Vue.js 프레임워크 전체 문서 |
| 🔷 | **TypeScript** | 프로그래밍 | 보통 | 타입 안전한 JavaScript 개발 |
| 🐍 | **Python** | 프로그래밍 | 쉬움 | Python 공식 튜토리얼 완전 정복 |
| ☸️ | **Kubernetes** | DevOps | 어려움 | 쿠버네티스 컨테이너 오케스트레이션 |

## 🏗️ 프로젝트 구조

```
Skill_Seekers/
├── web/                    # Next.js 프론트엔드 (한국어 UI)
│   ├── app/
│   │   ├── page.tsx       # 메인 홈페이지
│   │   ├── layout.tsx     # 레이아웃
│   │   └── globals.css    # 글로벌 스타일
│   └── package.json
│
├── backend/               # FastAPI 백엔드
│   ├── app/
│   │   └── main.py       # API 서버 (10개 한국어 프리셋 포함)
│   └── requirements.txt
│
├── cli/                   # 기존 Python CLI 도구들
│   ├── doc_scraper.py    # 문서 스크래핑
│   ├── package_skill.py  # 스킬 패키징
│   └── ...
│
└── configs/              # 프리셋 설정 파일들
    ├── react.json
    ├── nextjs.json
    └── ...
```

## 🔧 기술 스택

### 프론트엔드
- **Next.js 15** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS
- **React 19** - 최신 React

### 백엔드
- **FastAPI** - 고성능 Python 웹 프레임워크
- **Uvicorn** - ASGI 서버
- **WebSocket** - 실시간 진행상황
- **Pydantic** - 데이터 검증

### 기존 기능 (CLI)
- **BeautifulSoup4** - HTML 파싱
- **Requests** - HTTP 클라이언트
- **Python 3.10+** - 최신 Python

## 📖 상세 가이드

### API 문서
FastAPI는 자동으로 문서를 생성합니다:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 주요 API 엔드포인트

```typescript
// 프리셋 목록 조회
GET /api/presets

// 특정 프리셋 상세 정보
GET /api/presets/{preset_id}

// 스크래핑 시작
POST /api/scrape
{
  "config": {
    "name": "react",
    "description": "React 스킬",
    "base_url": "https://react.dev/",
    "max_pages": 500
  },
  "enhance": true
}

// 헬스 체크
GET /health
```

## 🎓 튜토리얼

### 커스텀 스킬 만들기

1. **웹 UI에서**:
   - "커스텀 스킬 만들기" 클릭
   - 문서 사이트 URL 입력
   - 스킬 이름과 설명 작성
   - "생성 시작" 클릭

2. **CLI에서**:
```bash
python3 cli/doc_scraper.py \
  --name myskill \
  --url https://docs.example.com/ \
  --description "나만의 스킬"
```

## ❓ FAQ

### Q: 왜 Next.js와 FastAPI를 함께 사용하나요?
A: 기존 Python CLI 코드를 재사용하면서, 모던하고 사용자 친화적인 웹 UI를 제공하기 위해서입니다.

### Q: 웹 UI 없이 CLI만 사용할 수 있나요?
A: 네! 기존 CLI 도구들은 그대로 사용 가능합니다.

### Q: API 키가 필요한가요?
A: 기본 기능은 API 키 없이 사용 가능합니다. AI 향상 기능을 사용하려면 Anthropic API 키가 필요합니다.

### Q: 스크래핑이 너무 오래 걸립니다
A: 대용량 문서의 경우 20-40분 정도 소요될 수 있습니다. `--async` 옵션을 사용하면 2-3배 빨라집니다.

## 🤝 기여하기

이 프로젝트는 원본 [Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers)를 포크하여 한국 개발자들을 위해 재구현한 버전입니다.

기여를 환영합니다! Pull Request를 보내주세요.

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

## 🙏 감사의 말

- 원본 프로젝트: [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers)
- Anthropic의 Claude AI
- 오픈소스 커뮤니티

---

**Made with ❤️ by Korean Developers**

궁금한 점이 있으시면 이슈를 남겨주세요!
