// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** checkVerificationCode POST /api/email/verification-code/check */
export async function checkVerificationCodeUsingPost(
  body: API.EmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/email/verification-code/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** sendVerificationCode POST /api/email/verification-code/send */
export async function sendVerificationCodeUsingPost(
  body: API.EmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseEmailVO_>('/api/email/verification-code/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
