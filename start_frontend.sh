#!/bin/bash
# Next.js 프론트엔드 시작 스크립트

echo "🎨 Skill Seeker 프론트엔드를 시작합니다..."

# web 디렉토리로 이동
cd "$(dirname "$0")/web"

# node_modules 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성을 설치합니다... (최초 1회, 1-2분 소요)"
    npm install
fi

# Next.js 개발 서버 실행
echo "🌐 Next.js 개발 서버를 시작합니다..."
echo "📍 URL: http://localhost:3000"
echo ""
npm run dev
