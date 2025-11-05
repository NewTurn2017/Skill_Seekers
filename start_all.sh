#!/bin/bash
# 백엔드와 프론트엔드를 동시에 실행하는 스크립트

echo "🚀 Skill Seeker 전체 애플리케이션을 시작합니다..."
echo ""

# 프로젝트 루트로 이동
cd "$(dirname "$0")"

# 백엔드 시작 (백그라운드)
echo "📌 1/2: 백엔드 시작 중..."
./start_backend.sh &
BACKEND_PID=$!

# 백엔드가 준비될 때까지 대기
sleep 3

# 프론트엔드 시작
echo "📌 2/2: 프론트엔드 시작 중..."
./start_frontend.sh

# 종료 시 백엔드도 같이 종료
trap "kill $BACKEND_PID" EXIT
