"use client";
import React, { useState } from 'react';
import { MdOutlineEmojiEmotions, MdSend, MdContentCopy } from 'react-icons/md';
import AIRoleLayout from '../components/AIRoleLayout';

export default function EmojiGeneratorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await fetch('/api/special-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'emoji-generator',
          input: input.trim(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '이모지 생성 중 오류가 발생했습니다.');
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        setError('클립보드 복사에 실패했습니다.');
      });
  };

  return (
    <AIRoleLayout
      title="이모지 생성기"
      description="텍스트를 입력하면 AI가 이모지로 변환해 드립니다. 메시지, 소셜 미디어, 프레젠테이션에 활용해보세요."
      gradientFrom="from-yellow-400"
      gradientTo="to-orange-500"
      icon={<MdOutlineEmojiEmotions size={30} />}
    >
      <div className="glass rounded-xl overflow-hidden shadow-lg">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-4">
            <label htmlFor="emoji-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              변환할 텍스트
            </label>
            <textarea
              id="emoji-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="여기에 텍스트를 입력하세요. 예: 행복한 생일 축하해!"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none transition-all duration-200"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                변환 중...
              </div>
            ) : (
              <>
                <MdSend className="mr-2" size={18} />
                이모지로 변환하기
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}
        </form>

        {result && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">변환 결과</h3>
                <button
                  onClick={copyToClipboard}
                  className="text-xs flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <MdContentCopy className="mr-1" size={14} />
                  {isCopied ? '복사됨!' : '복사'}
                </button>
              </div>
              
              <div className="p-4 bg-gray-100 dark:bg-gray-800/70 rounded-lg min-h-16 flex items-center justify-center">
                <div className="text-2xl sm:text-3xl md:text-4xl text-center break-words">
                  {result}
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                SNS, 메시지, 프레젠테이션 등에 활용해보세요!
              </div>
            </div>
          </div>
        )}
      </div>
    </AIRoleLayout>
  );
} 