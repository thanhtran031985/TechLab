import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  code: string;
  message: string;
  details?: unknown;
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccessResponse<T>>({ ok: true, data }, { status });
}

export function apiError(code: string, message: string, details?: unknown, status = 400) {
  return NextResponse.json<ApiErrorResponse>(
    {
      ok: false,
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    { status }
  );
}
