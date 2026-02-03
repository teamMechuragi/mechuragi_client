/**
 * 공통 API 클라이언트 설정
 */

// 일반 API URL (백엔드 서버)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 추천 API URL (추천 서버)
const RECOMMEND_BASE_URL = process.env.NEXT_PUBLIC_RECOMMEND_URL;

// 디버깅: 환경 변수 확인
console.log('🔧 [API Config] API_BASE_URL:', API_BASE_URL);
console.log('🔧 [API Config] RECOMMEND_BASE_URL:', RECOMMEND_BASE_URL);

/**
 * API 요청을 위한 공통 fetch 함수
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  console.log(`[API Request] Token check:`, {
    hasWindow: typeof window !== 'undefined',
    tokenExists: !!token,
    tokenLength: token ? token.length : 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
  });

  // FormData면 Content-Type 생략 (브라우저가 알아서 설정)
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('[API Request] ✅ Authorization header added');
  } else {
    console.warn('[API Request] ⚠️ No token found - Authorization header NOT added');
  }

  console.log(`[API Request] ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
  console.log(`[API Request] Headers:`, headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log(`[API Response] ${response.status} ${response.statusText}`);
  console.log(`[API Response] Headers:`, Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    // 401 에러 시 토큰 만료로 간주
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // 로그인 페이지로 리다이렉트할 수도 있음
    }

    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `API Error: ${response.status}`;
    console.error(`[API Error] ${errorMessage}`, errorData);
    throw new Error(errorMessage);
  }

  // 204 No Content인 경우 빈 객체 반환
  if (response.status === 204) {
    return {} as T;
  }

  // 응답 본문이 비어있는지 확인
  const text = await response.text();
  console.log(`[API Response] Body length:`, text.length);
  console.log(`[API Response] Body preview:`, text.substring(0, 200));

  if (!text || text.trim() === '') {
    console.log('[API Response] Empty body, returning empty object');
    return {} as T;
  }

  try {
    const parsed = JSON.parse(text);
    console.log('[API Response] Parsed successfully:', parsed);
    return parsed;
  } catch (error) {
    console.error('[API Error] Failed to parse JSON:', text);
    throw new Error('Invalid JSON response from server');
  }
}

/**
 * API 요청 (인증 불필요)
 */
export async function apiRequestPublic<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  if (!text || text.trim() === '') {
    return {} as T;
  }

  return JSON.parse(text);
}

export { API_BASE_URL, RECOMMEND_BASE_URL };
