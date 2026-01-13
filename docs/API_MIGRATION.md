# API 마이그레이션 완료 문서

## 📋 변경 사항 요약

### 1. API URL 분리

#### .env
```env
# API 베이스 URL (일반 API)
NEXT_PUBLIC_API_URL=http://mechuragi.kro.kr:8080/api

# 추천 API 베이스 URL (별도 서버)
NEXT_PUBLIC_RECOMMEND_URL=http://mechuragi.kro.kr:8082/recommend
```

#### .env.local
```env
# API 베이스 URL (일반 API)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 추천 API 베이스 URL (별도 서버)
NEXT_PUBLIC_RECOMMEND_URL=http://localhost:8082/recommend
```

- **이유**: 추천 API는 별도의 오리진에서 실행됨
- **적용**: `app/api/recommendApi.ts`가 `RECOMMEND_BASE_URL` 사용

### 2. 디렉토리 구조 통합

#### Before
```
web/
├── lib/api/voteApi.ts (axios 사용)
└── app/api/notificationApi.ts
```

#### After
```
web/app/api/
├── apiClient.ts         # 공통 fetch 래퍼
├── authApi.ts           # 인증
├── memberApi.ts         # 회원
├── preferenceApi.ts     # 선호도
├── recommendApi.ts      # 추천 (RECOMMEND_URL)
├── voteApi.ts           # 투표
├── notificationApi.ts   # 알림
└── index.ts             # 통합 export
```

### 3. 모든 컴포넌트 업데이트

다음 컴포넌트들의 직접 fetch 호출을 API 함수로 교체:

#### Recommend 페이지들
- ✅ `app/recommend/mood/page.tsx` → `getRecommendation()`
- ✅ `app/recommend/weather/page.tsx` → `getRecommendation()`
- ✅ `app/recommend/time/page.tsx` → `getRecommendation()`
- ✅ `app/recommend/ingredients/page.tsx` → `getRecommendation()`
- ✅ `app/recommend/Aichat/page.tsx` → `chatRecommend()`

#### 인증 페이지들
- ✅ `app/login/components/LoginForm.tsx` → `authApi.login()`
- ✅ `app/oauth/success/page.tsx` → `memberApi.getMember()`

#### Context
- ✅ `app/context/UserContext.tsx` → `getMember()`, `getPreferences()`, `getPreference()`

#### Community 페이지들
- ✅ `app/community/**/*.tsx` → import 경로 변경 `@/app/api/voteApi`

## 🎯 주요 개선사항

### 1. 타입 안전성
- 모든 API 함수에 TypeScript 타입 정의
- Request/Response 인터페이스 명확히 정의

### 2. 에러 처리 통일
```typescript
// apiClient.ts에서 401 자동 처리
if (response.status === 401 && typeof window !== 'undefined') {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}
```

### 3. 코드 재사용성
```typescript
// Before: 각 컴포넌트에서 중복 코드
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});

// After: 단일 함수 호출
const data = await getRecommendation(requestData);
```

### 4. 유지보수성
- API 변경 시 한 곳만 수정
- 테스트 작성 용이
- Mock 데이터 교체 간편

## 📝 사용 예시

### 기분 기반 추천
```typescript
import { getRecommendation } from '@/app/api/recommendApi';

const data = await getRecommendation({
  type: "FEELING",
  feeling: "행복해요",
  dietStatus: "다이어트_중",
  veganOption: "비건",
  spiceLevel: "순한맛",
  foodTypes: ["한식", "일식"],
  tastes: ["단맛", "짠맛"],
  dislikedFoods: ["파"],
});
```

### AI 채팅 추천
```typescript
import { chatRecommend } from '@/app/api/recommendApi';

const data = await chatRecommend({
  chatMessage: "오늘 뭐 먹을까요?",
  dietStatus: activePreferenceDetail.isOnDiet,
  veganOption: activePreferenceDetail.veganOption,
  // ...나머지 취향 데이터
});
```

### 로그인
```typescript
import { login } from '@/app/api/authApi';

const data = await login({
  email: "user@example.com",
  password: "password123"
});

localStorage.setItem("accessToken", data.tokens.accessToken);
localStorage.setItem("refreshToken", data.tokens.refreshToken);
```

## 🚀 향후 개선 사항

1. **React Query 도입** - 캐싱과 상태 관리 개선
2. **API 재시도 로직** - 네트워크 오류 시 자동 재시도
3. **로딩 상태 통합** - 전역 로딩 인디케이터
4. **에러 토스트** - 사용자 친화적인 에러 메시지

## ✅ 체크리스트

- [x] .env.local에 두 개의 URL 설정
- [x] apiClient.ts에서 두 URL export
- [x] recommendApi.ts가 RECOMMEND_URL 사용
- [x] 모든 recommend 페이지 API 함수 사용
- [x] 인증 관련 페이지 API 함수 사용
- [x] UserContext API 함수 사용
- [x] lib/api/voteApi.ts 삭제
- [x] 빌드 성공 확인

## 📦 파일 변경 내역

### 새로 생성
- `app/api/apiClient.ts` - 공통 fetch 래퍼
- `app/api/authApi.ts` - 인증 API
- `app/api/memberApi.ts` - 회원 API
- `app/api/preferenceApi.ts` - 선호도 API
- `app/api/recommendApi.ts` - 추천 API (별도 URL)
- `app/api/voteApi.ts` - 투표 API (fetch 기반)
- `app/api/index.ts` - 통합 export
- `app/api/README.md` - API 문서

### 수정됨
- `app/recommend/mood/page.tsx`
- `app/recommend/weather/page.tsx`
- `app/recommend/time/page.tsx`
- `app/recommend/ingredients/page.tsx`
- `app/recommend/Aichat/page.tsx`
- `app/login/components/LoginForm.tsx`
- `app/oauth/success/page.tsx`
- `app/context/UserContext.tsx`
- `app/community/**/*.tsx` (import 경로만 변경)
- `.env.local`

### 삭제됨
- `lib/api/voteApi.ts` (axios 버전)
