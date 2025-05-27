"use client";
import React, { useState } from 'react';
import { MdOutlineTranslate, MdSend, MdContentCopy, MdSwapHoriz } from 'react-icons/md';
import AIRoleLayout from '../components/AIRoleLayout';

// 지원하는 언어 목록
const languages = [
  { id: 'english', name: '영어', flag: '🇺🇸' },
  { id: 'japanese', name: '일본어', flag: '🇯🇵' },
  { id: 'chinese', name: '중국어', flag: '🇨🇳' },
];

export default function TranslatorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('english');
  const [resultLanguage, setResultLanguage] = useState('영어');
  const [recentTranslations, setRecentTranslations] = useState<{ input: string; output: string; language: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/special-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'translator',
          input: input.trim(),
          options: {
            targetLanguage,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '번역 중 오류가 발생했습니다.');
      }

      setResult(data.result);
      
      const selectedLanguage = languages.find(lang => lang.id === targetLanguage)?.name || '영어';
      setResultLanguage(selectedLanguage);
      
      if (data.result) {
        setRecentTranslations(prev => [
          { 
            input: input.trim(), 
            output: data.result, 
            language: selectedLanguage
          },
          ...prev.slice(0, 4)
        ]);
      }
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

  const selectTranslation = (item: { input: string; output: string; language: string }) => {
    setInput(item.input);
    setResult(item.output);
    setResultLanguage(item.language);
  };

  return (
    <AIRoleLayout
      title="번역 앱"
      description="한국어를 영어, 일본어, 중국어로 빠르게 번역합니다. 고품질 AI 번역으로 정확한 결과를 제공합니다."
      gradientFrom="from-blue-400"
      gradientTo="to-indigo-500"
      icon={<MdOutlineTranslate size={30} />}
    >
      <div className="glass rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 sm:p-6">
          {/* 언어 선택 버튼 */}
          <div className="mb-5">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              번역할 언어 선택
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setTargetLanguage(lang.id)}
                  className={`px-4 py-2 rounded-lg flex items-center text-sm transition-all ${
                    targetLanguage === lang.id
                      ? 'bg-blue-500 text-white font-medium shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1.5">{lang.flag}</span> {lang.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="translation-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                번역할 한국어 텍스트
              </label>
              <textarea
                id="translation-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="번역할 텍스트를 입력하세요."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200"
                rows={4}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  번역 중...
                </div>
              ) : (
                <>
                  <MdSend className="mr-2" size={18} />
                  번역하기
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm rounded-lg">
                {error}
              </div>
            )}
          </form>

          {/* 번역 결과 */}
          {result && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  번역 결과 ({resultLanguage})
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="text-xs flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <MdContentCopy className="mr-1" size={14} />
                  {isCopied ? '복사됨!' : '복사'}
                </button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 최근 번역 내역 */}
        {recentTranslations.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">최근 번역 내역</h3>
            <div className="space-y-3">
              {recentTranslations.map((item, index) => (
                <div 
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => selectTranslation(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      한국어 → {item.language}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                      {item.input}
                    </div>
                    <div className="hidden sm:block text-gray-400">
                      <MdSwapHoriz />
                    </div>
                    <div className="flex-1 text-sm text-blue-600 dark:text-blue-400 font-medium line-clamp-1">
                      {item.output}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AIRoleLayout>
  );
} 