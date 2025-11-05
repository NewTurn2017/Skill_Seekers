#!/bin/bash
# FastAPI 백엔드 시작 스크립트

echo "🚀 Skill Seeker 백엔드를 시작합니다..."

# 프로젝트 루트로 이동
cd "$(dirname "$0")"

# 가상환경 확인
if [ ! -d "venv" ]; then
    echo "📦 가상환경을 생성합니다..."
    python3 -m venv venv
fi

# 가상환경 활성화
echo "✅ 가상환경을 활성화합니다..."
source venv/bin/activate

# 의존성 설치 확인
echo "📚 의존성을 확인합니다..."
pip install -r backend/requirements.txt -q

# FastAPI 서버 실행
echo "🌐 FastAPI 서버를 시작합니다..."
echo "📍 URL: http://localhost:8000"
echo "📖 API 문서: http://localhost:8000/docs"
echo ""
python backend/app/main.py
