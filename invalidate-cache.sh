#!/bin/bash
# CloudFront 캐시 완전 무효화 스크립트

echo "🔄 CloudFront 캐시 무효화 시작..."

aws cloudfront create-invalidation \
  --distribution-id E2055JLBFIVGCA \
  --paths "/*"

echo "✅ 캐시 무효화 요청 완료!"
echo "⏰ 적용까지 5-10분 소요됩니다."
