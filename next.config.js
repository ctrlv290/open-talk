/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // HTML 속성 순서 차이로 인한 hydration 불일치 허용
  experimental: {
    // 서버와 클라이언트 간의 HTML 속성 차이를 허용
    skipTrailingSlashRedirect: true,
    // 서버와 클라이언트 간의 타임존 차이를 허용
    scrollRestoration: true,
  },
  // 서버에서 생성된 HTML과 클라이언트에서 생성된 DOM 간의 차이 무시
  onDemandEntries: {
    // 개발 서버가 빌드된 페이지를 메모리에 보관하는 시간(초)
    maxInactiveAge: 25 * 1000,
    // 한 번에 메모리에 보관할 페이지 수
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 