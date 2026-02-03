import { apiRequestPublic } from './apiClient';

/**
 * 인증 이메일 발송
 */
export async function sendVerificationEmail(email: string): Promise<void> {
  await apiRequestPublic<void>('/email/send', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * 이메일 인증 코드 검증
 */
export async function verifyEmailCode(email: string, verificationCode: string): Promise<void> {
  await apiRequestPublic<void>('/email/verify', {
    method: 'POST',
    body: JSON.stringify({ email, verificationCode }),
  });
}
