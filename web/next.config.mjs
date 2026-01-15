/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // - 서버 런타임이 필요 없고, 결과물은 CDN에 올려서 정적 사이트처럼 서빙
  trailingSlash: true,

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