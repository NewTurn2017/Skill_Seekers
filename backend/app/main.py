"""
Skill Seeker FastAPI 백엔드
기존 Python CLI를 웹 API로 래핑
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
import sys
import os

# 프로젝트 루트를 Python 경로에 추가
project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, project_root)

app = FastAPI(
    title="Skill Seeker API",
    description="문서 사이트를 Claude AI 스킬로 변환하는 API",
    version="2.0.0"
)

# CORS 설정 (Next.js 프론트엔드와 통신)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js 기본 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 모델
class ScraperConfig(BaseModel):
    """스크래퍼 설정"""
    name: str
    description: str
    base_url: HttpUrl
    max_pages: Optional[int] = 500
    rate_limit: Optional[float] = 0.5

class PresetInfo(BaseModel):
    """프리셋 정보"""
    id: str
    name: str
    description: str
    category: str
    difficulty: str  # "쉬움", "보통", "어려움"
    icon: str
    example_url: str

class ScrapeRequest(BaseModel):
    """스크래핑 요청"""
    config: ScraperConfig
    enhance: Optional[bool] = False

# 한국어 프리셋 목록 (실제 활용 가능한 10개 예제)
KOREAN_PRESETS: List[PresetInfo] = [
    PresetInfo(
        id="react",
        name="React",
        description="리액트 공식 문서로 최신 프론트엔드 개발 스킬 생성",
        category="프론트엔드",
        difficulty="쉬움",
        icon="⚛️",
        example_url="https://react.dev/"
    ),
    PresetInfo(
        id="nextjs",
        name="Next.js",
        description="Next.js 풀스택 프레임워크 문서로 스킬 생성",
        category="프론트엔드",
        difficulty="보통",
        icon="▲",
        example_url="https://nextjs.org/docs"
    ),
    PresetInfo(
        id="fastapi",
        name="FastAPI",
        description="FastAPI Python 웹 프레임워크로 백엔드 API 개발 스킬",
        category="백엔드",
        difficulty="쉬움",
        icon="⚡",
        example_url="https://fastapi.tiangolo.com/"
    ),
    PresetInfo(
        id="django",
        name="Django",
        description="Django Python 웹 프레임워크 전체 문서 스킬",
        category="백엔드",
        difficulty="보통",
        icon="🎸",
        example_url="https://docs.djangoproject.com/"
    ),
    PresetInfo(
        id="tailwind",
        name="Tailwind CSS",
        description="Tailwind CSS 유틸리티 클래스로 빠른 스타일링 스킬",
        category="CSS/디자인",
        difficulty="쉬움",
        icon="🎨",
        example_url="https://tailwindcss.com/docs"
    ),
    PresetInfo(
        id="godot",
        name="Godot 게임엔진",
        description="Godot 게임 개발 엔진 완전 가이드 스킬",
        category="게임 개발",
        difficulty="보통",
        icon="🎮",
        example_url="https://docs.godotengine.org/"
    ),
    PresetInfo(
        id="vue",
        name="Vue.js",
        description="Vue.js 프론트엔드 프레임워크 문서 스킬",
        category="프론트엔드",
        difficulty="쉬움",
        icon="💚",
        example_url="https://vuejs.org/guide/"
    ),
    PresetInfo(
        id="typescript",
        name="TypeScript",
        description="TypeScript 공식 핸드북으로 타입 안전 개발 스킬",
        category="프로그래밍 언어",
        difficulty="보통",
        icon="🔷",
        example_url="https://www.typescriptlang.org/docs/"
    ),
    PresetInfo(
        id="python",
        name="Python 튜토리얼",
        description="Python 공식 튜토리얼로 기초부터 고급까지",
        category="프로그래밍 언어",
        difficulty="쉬움",
        icon="🐍",
        example_url="https://docs.python.org/3/tutorial/"
    ),
    PresetInfo(
        id="kubernetes",
        name="Kubernetes",
        description="쿠버네티스 컨테이너 오케스트레이션 문서 스킬",
        category="DevOps",
        difficulty="어려움",
        icon="☸️",
        example_url="https://kubernetes.io/docs/"
    )
]

@app.get("/")
async def root():
    """API 루트"""
    return {
        "message": "Skill Seeker API에 오신 것을 환영합니다!",
        "docs": "/docs",
        "version": "2.0.0"
    }

@app.get("/api/presets", response_model=List[PresetInfo])
async def get_presets():
    """사용 가능한 프리셋 목록 조회"""
    return KOREAN_PRESETS

@app.get("/api/presets/{preset_id}", response_model=PresetInfo)
async def get_preset(preset_id: str):
    """특정 프리셋 상세 정보 조회"""
    preset = next((p for p in KOREAN_PRESETS if p.id == preset_id), None)
    if not preset:
        raise HTTPException(status_code=404, detail="프리셋을 찾을 수 없습니다")
    return preset

@app.post("/api/scrape")
async def scrape_documentation(request: ScrapeRequest):
    """
    문서 스크래핑 시작
    실제 구현에서는 백그라운드 태스크로 실행
    """
    try:
        # TODO: 실제 doc_scraper.py 호출 구현
        return {
            "status": "started",
            "message": f"{request.config.name} 스크래핑이 시작되었습니다",
            "job_id": "temp-job-id"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/configs")
async def list_configs():
    """저장된 설정 파일 목록"""
    config_dir = os.path.join(project_root, "configs")
    if not os.path.exists(config_dir):
        return []

    configs = []
    for filename in os.listdir(config_dir):
        if filename.endswith('.json'):
            configs.append({
                "id": filename.replace('.json', ''),
                "filename": filename
            })
    return configs

@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
