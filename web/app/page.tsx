export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🎯 스킬 시커
            </h1>
            <nav className="flex gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">기능</a>
              <a href="#examples" className="text-gray-600 hover:text-gray-900">예제</a>
              <a href="#start" className="text-gray-600 hover:text-gray-900">시작하기</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            문서 사이트를<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Claude AI 스킬로
            </span>
            <br />
            자동 변환하세요
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            복잡한 설정 없이 클릭 몇 번으로 어떤 문서 사이트든 Claude AI가 이해할 수 있는 스킬로 만들어드립니다.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="#start"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              지금 시작하기 →
            </a>
            <a
              href="#examples"
              className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:border-gray-400 transition"
            >
              예제 보기
            </a>
          </div>
        </div>
      </section>

      {/* 3단계 프로세스 */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            단 3단계로 완성! 🚀
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">1. URL 입력</h4>
              <p className="text-gray-600">
                변환하고 싶은 문서 사이트의 주소를 입력하세요
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">2. 자동 변환</h4>
              <p className="text-gray-600">
                AI가 문서를 분석하고 최적화된 스킬을 생성합니다
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">3. 바로 사용</h4>
              <p className="text-gray-600">
                생성된 스킬을 Claude AI에 업로드하고 사용하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 활용 예제 10개 */}
      <section id="examples" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
          실제 활용 가능한 스킬 예제
        </h3>
        <p className="text-center text-gray-600 mb-12">
          클릭 한 번으로 바로 생성할 수 있습니다
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* React */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">⚛️</span>
              <div>
                <h4 className="font-semibold text-lg">React</h4>
                <span className="text-sm text-gray-500">프론트엔드</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              최신 React 문서로 컴포넌트 개발 스킬 생성
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">쉬움</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">인기</span>
            </div>
          </div>

          {/* Next.js */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">▲</span>
              <div>
                <h4 className="font-semibold text-lg">Next.js</h4>
                <span className="text-sm text-gray-500">풀스택</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Next.js 풀스택 프레임워크 완전 가이드
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">보통</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">인기</span>
            </div>
          </div>

          {/* FastAPI */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">⚡</span>
              <div>
                <h4 className="font-semibold text-lg">FastAPI</h4>
                <span className="text-sm text-gray-500">백엔드</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              FastAPI로 빠른 API 개발 스킬
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">쉬움</span>
            </div>
          </div>

          {/* Django */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🎸</span>
              <div>
                <h4 className="font-semibold text-lg">Django</h4>
                <span className="text-sm text-gray-500">백엔드</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Django 웹 프레임워크 전체 문서
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">보통</span>
            </div>
          </div>

          {/* Tailwind CSS */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🎨</span>
              <div>
                <h4 className="font-semibold text-lg">Tailwind CSS</h4>
                <span className="text-sm text-gray-500">CSS/디자인</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              유틸리티 클래스로 빠른 스타일링
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">쉬움</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">인기</span>
            </div>
          </div>

          {/* Godot */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🎮</span>
              <div>
                <h4 className="font-semibold text-lg">Godot</h4>
                <span className="text-sm text-gray-500">게임개발</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Godot 게임엔진 완전 가이드
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">보통</span>
            </div>
          </div>

          {/* Vue.js */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">💚</span>
              <div>
                <h4 className="font-semibold text-lg">Vue.js</h4>
                <span className="text-sm text-gray-500">프론트엔드</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Vue.js 프레임워크 전체 문서
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">쉬움</span>
            </div>
          </div>

          {/* TypeScript */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🔷</span>
              <div>
                <h4 className="font-semibold text-lg">TypeScript</h4>
                <span className="text-sm text-gray-500">프로그래밍</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              타입 안전한 JavaScript 개발
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">보통</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">인기</span>
            </div>
          </div>

          {/* Python */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🐍</span>
              <div>
                <h4 className="font-semibold text-lg">Python</h4>
                <span className="text-sm text-gray-500">프로그래밍</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Python 공식 튜토리얼 완전 정복
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">쉬움</span>
            </div>
          </div>

          {/* Kubernetes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">☸️</span>
              <div>
                <h4 className="font-semibold text-lg">Kubernetes</h4>
                <span className="text-sm text-gray-500">DevOps</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              쿠버네티스 컨테이너 오케스트레이션
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">어려움</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section id="start" className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            지금 바로 시작해보세요
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            무료로 사용 가능합니다. 설치나 회원가입 필요 없습니다.
          </p>
          <a
            href="/create"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block"
          >
            스킬 생성 시작하기 →
          </a>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">스킬 시커</h4>
              <p className="text-sm">
                Claude AI 스킬을 쉽고 빠르게 생성하는 도구
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">링크</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/yusufkaraaslan/Skill_Seekers" className="hover:text-white">GitHub</a></li>
                <li><a href="#" className="hover:text-white">문서</a></li>
                <li><a href="#" className="hover:text-white">가이드</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">도움말</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">문제 신고</a></li>
                <li><a href="#" className="hover:text-white">커뮤니티</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>Made with ❤️ by Korean Developers | MIT License</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
