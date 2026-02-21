import { NextResponse } from 'next/server';

/**
 * AI 학생 행동 분석 프록시 API
 * 클라이언트의 입력을 받아 환경 변수에 설정된 GAS_URL로 전달합니다.
 */
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const gasUrl = process.env.GAS_URL;
    const authKey = process.env.AUTH_KEY;

    if (!gasUrl || !authKey) {
      console.error('환경 변수(GAS_URL 또는 AUTH_KEY)가 설정되지 않았습니다.');
      return NextResponse.json(
        { success: false, message: '서버 설정 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // GAS로 요청 전송
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        authKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`GAS 서버 응답 오류: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('API 라우트 처리 중 오류:', error);
    return NextResponse.json(
      { success: false, message: error.message || '서버 통신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
