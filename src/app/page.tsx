'use client';

import { useState } from 'react';

/**
 * AI 학생 행동 기록 시스템 - 클라이언트 UI
 */
export default function Home() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      alert('기록할 내용을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setStatusMsg('AI가 분석 중입니다...');
    setResult(null);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await resp.json();

      if (data.success) {
        setResult(data.data);
        setStatusMsg('기록이 완료되었습니다!');
        setInputText('');
      } else {
        setStatusMsg(`오류: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setStatusMsg('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm lg:flex flex-col gap-8">

        {/* 헤더 섹션 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter glow-text text-blue-400">
            AI 학생 행동 기록 시스템
          </h1>
          <p className="text-gray-400 text-lg">
            선생님의 관찰 기록을 AI가 분석하여 자동으로 정리합니다.
          </p>
        </div>

        {/* 입력 섹션 */}
        <div className="w-full glass-panel p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="action-input" className="text-blue-300 font-semibold text-sm uppercase tracking-widest">
              행동 관찰 기록
            </label>
            <textarea
              id="action-input"
              className="w-full h-40 bg-black/40 border border-white/10 rounded-lg p-4 text-white text-base input-glow transition-all resize-none"
              placeholder="예: 1번 김철수가 오늘 수업 시간에 친구들을 도와줌. 5번 박영희는 발표를 아주 잘했음."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2
              ${loading
                ? 'bg-blue-900/50 text-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]'
              }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                분석 및 기록 중...
              </>
            ) : (
              '기록 전송하기'
            )}
          </button>
        </div>

        {/* 상태 및 결과 출력 섹션 */}
        {(statusMsg || result) && (
          <div className="w-full glass-panel p-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-200">분석 결과</h2>
              <span className={`text-sm ${statusMsg.includes('오류') ? 'text-red-400' : 'text-green-400'}`}>
                {statusMsg}
              </span>
            </div>

            {result && result.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="py-2 px-4 font-medium">번호</th>
                      <th className="py-2 px-4 font-medium">이름</th>
                      <th className="py-2 px-4 font-medium">분석된 행동</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-blue-300">{item.번호}</td>
                        <td className="py-3 px-4 font-medium">{item.이름}</td>
                        <td className="py-3 px-4 text-gray-300">{item.행동}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : result && result.length === 0 ? (
              <p className="text-gray-500 italic text-center py-4">식별된 학생 정보가 없습니다.</p>
            ) : null}
          </div>
        )}

      </div>

      {/* 배경 장식 요소 */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>
    </main>
  );
}
