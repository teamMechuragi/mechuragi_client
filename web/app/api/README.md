# API 디렉토리

이 디렉토리는 모든 백엔드 API 호출 로직을 도메인별로 분리하여 관리합니다.

## ⚠️ 중요 변경 사항

- **API URL 분리**: 일반 API와 추천 API가 서로 다른 오리진 사용
  - `NEXT_PUBLIC_API_URL`: 일반 백엔드 API (https://mechuragi.kro.kr/api)
  - `NEXT_PUBLIC_RECOMMEND_URL`: 추천 전용 서버 (https://recommend.mechuragi.kro.kr)
- **경로 통합**: `@web/lib/api` → `@web/app/api`로 모든 API 파일 이동
- **일관된 구조**: 모든 컴포넌트에서 직접 fetch 사용 금지, API 파일 사용 필수

## 📁 구조

```
app/api/
├── apiClient.ts        # 공통 API 클라이언트 (fetch 래퍼)
├── authApi.ts          # 인증 관련 (로그인, 회원가입, 로그아웃)
├── memberApi.ts        # 회원 정보 관리
├── preferenceApi.ts    # 사용자 선호도 설정
├── recommendApi.ts     # 메뉴 추천
├── voteApi.ts          # 투표/커뮤니티
├── notificationApi.ts  # 알림
└── index.ts            # 통합 export
```

## 🔧 사용법

### 1. 개별 import

```typescript
import { login, signup } from '@/app/api/authApi';
import { getMember, updateProfile } from '@/app/api/memberApi';
import { getPreferences } from '@/app/api/preferenceApi';
```

### 2. 통합 import

```typescript
import { login, getMember, getPreferences } from '@/app/api';
```

## 📝 API 클라이언트

`apiClient.ts`는 모든 API 호출의 기본이 되는 공통 함수를 제공합니다:

- **apiRequest**: 인증이 필요한 API 호출
- **apiRequestPublic**: 인증이 필요 없는 API 호출
- **API_BASE_URL**: API 서버 주소

### 특징

- 자동 토큰 추가 (localStorage에서 accessToken 읽기)
- 401 에러 시 자동 토큰 삭제
- 에러 처리 통일
- TypeScript 타입 안전성

## 🔐 인증 처리

API 클라이언트는 자동으로 localStorage에서 `accessToken`을 읽어 헤더에 추가합니다.

```typescript
// 자동으로 Authorization 헤더가 추가됩니다
const user = await getMember(123);
```

## 🎯 도메인별 API

### authApi.ts - 인증

- `login()` - 로그인
- `signup()` - 회원가입
- `logout()` - 로그아웃
- `refreshToken()` - 토큰 갱신

### memberApi.ts - 회원 정보

- `getMyInfo()` - 내 정보 조회
- `getMember()` - 특정 회원 조회
- `updateProfile()` - 프로필 수정
- `changePassword()` - 비밀번호 변경
- `withdrawal()` - 회원 탈퇴
- `uploadProfileImage()` - 프로필 이미지 업로드

### preferenceApi.ts - 선호도

- `getPreferences()` - 선호도 목록
- `getPreference()` - 선호도 상세
- `createPreference()` - 선호도 생성
- `updatePreference()` - 선호도 수정
- `deletePreference()` - 선호도 삭제
- `activatePreference()` - 선호도 활성화

### recommendApi.ts - 추천

- `getRecommendation()` - 메뉴 추천
- `chatRecommend()` - AI 채팅 추천
- `recommendByMood()` - 기분 기반 추천
- `recommendByWeather()` - 날씨 기반 추천
- `recommendByTime()` - 시간대 기반 추천
- `recommendByIngredients()` - 재료 기반 추천

### voteApi.ts - 투표

- `createVote()`, `getVote()`, `updateVote()`, `deleteVote()` - CRUD
- `getActiveVotes()`, `getHotVotes()`, `getCompletedVotes()` - 목록 조회
- `participateVote()`, `cancelParticipation()` - 투표 참여
- `createComment()`, `getComments()`, `updateComment()`, `deleteComment()` - 댓글
- `toggleLike()`, `isLiked()`, `getLikeCount()` - 좋아요
- `getPopularMenus()` - 인기 메뉴

## ⚙️ 환경 변수

`.env.local`에서 API 서버 주소를 설정합니다:

```env
NEXT_PUBLIC_API_URL=https://mechuragi.kro.kr/api
```

## 📌 모범 사례

1. **컴포넌트에서 직접 fetch 사용 금지** - 반드시 API 파일 사용
2. **에러 처리** - try-catch로 감싸서 사용
3. **타입 안전성** - TypeScript 타입 활용
4. **재사용성** - 같은 API 호출이 여러 곳에서 필요하면 함수로 분리

### ✅ Good

```typescript
import { login } from '@/app/api/authApi';

try {
  const data = await login({ email, password });
  // 성공 처리
} catch (error) {
  // 에러 처리
}
```

### ❌ Bad

```typescript
// 컴포넌트에서 직접 fetch 사용
const response = await fetch('https://api.com/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
```
