# Skill Seeker - 백엔드 (FastAPI)

기존 Python CLI를 FastAPI로 래핑한 백엔드 서버입니다.

## 서버 실행

```bash
# 가상환경 활성화
source ../venv/bin/activate  # Windows: ..\venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 시작
python app/main.py
```

서버가 http://localhost:8000 에서 실행됩니다.

## API 문서

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 주요 엔드포인트

### GET `/api/presets`
사용 가능한 프리셋 목록 조회

### GET `/api/presets/{preset_id}`
특정 프리셋 상세 정보 조회

### POST `/api/scrape`
문서 스크래핑 시작

요청 예시:
```json
{
  "config": {
    "name": "react",
    "description": "React 스킬",
    "base_url": "https://react.dev/",
    "max_pages": 500
  },
  "enhance": true
}
```

### GET `/health`
서버 상태 확인

## 기술 스택

- **FastAPI 0.115** - 고성능 웹 프레임워크
- **Uvicorn** - ASGI 서버
- **Pydantic** - 데이터 검증
- **WebSocket** - 실시간 통신

## 개발

```bash
# 자동 리로드 모드로 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 테스트

```bash
# 헬스 체크
curl http://localhost:8000/health

# 프리셋 목록
curl http://localhost:8000/api/presets
```
