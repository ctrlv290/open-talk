"use client";
import React, { useState } from 'react';
import { MdOutlineColorLens, MdSend, MdContentCopy } from 'react-icons/md';
import AIRoleLayout from '../components/AIRoleLayout';

export default function ColorGeneratorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ css_code: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<{ input: string; color: string }[]>([]);

  // CSS 색상 코드 정제 함수
  const sanitizeColorCode = (colorCode: string): string => {
    // 세미콜론이나 다른 CSS 문법 제거
    let sanitized = colorCode.trim();
    
    // 세미콜론 제거
    sanitized = sanitized.replace(/;/g, '');
    
    // background-color: 같은 속성명 제거
    sanitized = sanitized.replace(/^(background-color:|color:|rgb\(|rgba\(|hsl\(|hsla\()/, '');
    
    // 색상 코드가 유효한 HEX 형식인지 확인
    if (!sanitized.startsWith('#')) {
      // RGB 형식이거나 색상명인 경우 처리
      if (sanitized.match(/^[0-9]{1,3},\s*[0-9]{1,3},\s*[0-9]{1,3}$/)) {
        // RGB 형식이면 HEX로 변환
        const [r, g, b] = sanitized.split(',').map(c => parseInt(c.trim(), 10));
        sanitized = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      } else if (!sanitized.startsWith('#')) {
        // 유효하지 않은 형식이면 기본 색상 반환
        sanitized = '#7B68EE';
      }
    }
    
    return sanitized;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
          role: 'color-generator',
          input: input.trim(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '색상 생성 중 오류가 발생했습니다.');
      }

      const colorResult = data.result;
      
      // 색상 코드 정제
      if (colorResult?.css_code) {
        colorResult.css_code = sanitizeColorCode(colorResult.css_code);
      }
      
      setResult(colorResult);
      
      // 히스토리에 추가
      if (colorResult?.css_code) {
        setHistory(prev => [
          { input: input.trim(), color: colorResult.css_code },
          ...prev.slice(0, 9) // 최대 10개 저장
        ]);
      }
      
      setInput(''); // 입력 초기화
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        setError('클립보드 복사에 실패했습니다.');
      });
  };

  const selectFromHistory = (item: { input: string; color: string }) => {
    setInput(item.input);
    setResult({ css_code: sanitizeColorCode(item.color) });
  };

  // HEX를 RGB로 변환하는 함수
  const hexToRgb = (hex: string) => {
    try {
      // 색상 코드 정제
      const cleanHex = sanitizeColorCode(hex).replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return { r, g, b };
    } catch (_) {
      // 변환 실패 시 기본값 반환
      return { r: 123, g: 104, b: 238 }; // 기본 보라색
    }
  };

  // 대비색 계산 (스크린)
  const getContrastColor = (hexColor: string) => {
    try {
      const { r, g, b } = hexToRgb(hexColor);
      // 밝기 계산 (W3C 공식)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#000000' : '#FFFFFF';
    } catch {
      return '#FFFFFF'; // 기본값 반환
    }
  };

  return (
    <AIRoleLayout
      title="컬러 생성"
      description="스크린명으로 분위기에 맞는 색상을 찾아주세요. 예) 바다의 뜻을.. 또는 노을 바다.."
      gradientFrom="from-teal-400"
      gradientTo="to-emerald-500"
      icon={<MdOutlineColorLens size={30} />}
    >
      <div className="glass rounded-xl overflow-hidden shadow-lg">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="mb-4">
            <label htmlFor="color-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              색상 이름
            </label>
            <textarea
              id="color-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="색상을 분위기와 함께 입력해주세요. 예) 바다의 뜻을.. 또는 노을 바다.."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-all duration-200"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                색상 생성중..
              </div>
            ) : (
              <>
                <MdSend className="mr-2" size={18} />
                색상 생성
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}
        </form>

        {result?.css_code && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">색상 결과</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(result.css_code)}
                    className="text-xs flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <MdContentCopy className="mr-1" size={14} />
                    {isCopied ? '복사됨' : '복사'}
                  </button>
                </div>
              </div>
              
              <div 
                className="rounded-lg overflow-hidden flex items-center justify-center transition-all duration-500 h-40 md:h-48"
                style={{ 
                  backgroundColor: sanitizeColorCode(result.css_code),
                  color: getContrastColor(result.css_code)
                }}
              >
                <div className="text-center p-4">
                  <div className="text-lg md:text-xl font-mono mb-2">{result.css_code}</div>
                  <div className="text-sm opacity-80">{input}</div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {/* 양대비 시 */}
                {Array.from({ length: 5 }).map((_, i) => {
                  try {
                    const { r, g, b } = hexToRgb(result.css_code);
                    // 영대비 조정 (오두밝게)
                    const factor = 0.7 + (i * 0.15); // 0.7, 0.85, 1.0, 1.15, 1.3
                    const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
                    const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
                    const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
                    const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
                    
                    return (
                      <div 
                        key={i} 
                        className="h-8 rounded-md flex-1 flex items-center justify-center cursor-pointer text-xs font-mono"
                        style={{ 
                          backgroundColor: sanitizeColorCode(newHex),
                          color: getContrastColor(newHex),
                          minWidth: '60px'
                        }}
                        onClick={() => copyToClipboard(newHex)}
                        title="클릭하여 복사"
                      >
                        {newHex}
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })}
              </div>
            </div>
          </div>
        )}

        {/* 색상 히스토리 */}
        {history.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">최근 생성 색상</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {history.map((item, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-md cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: sanitizeColorCode(item.color) }}
                  onClick={() => selectFromHistory(item)}
                  title={item.input}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AIRoleLayout>
  );
} 
