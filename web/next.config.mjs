/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 로컬 개발 시 주석 처리 (프로덕션 빌드 시 활성화)
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig