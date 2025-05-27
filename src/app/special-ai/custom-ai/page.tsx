"use client";
import React, { useState, useEffect } from 'react';
import { MdOutlineSettingsSuggest, MdSend, MdDelete, MdAdd, MdCheck, MdEdit } from 'react-icons/md';
import AIRoleLayout from '../components/AIRoleLayout';

// 기본 제공되는 시스템 메시지 템플릿
const systemTemplates = [
  {
    title: "친절한 비서",
    description: "일정 관리, 할 일 목록, 리마인더 등을 도와주는 비서",
    systemMessage: "당신은 매우 친절하고 효율적인 비서입니다. 사용자의 일정 관리, 할 일 목록, 리마인더 등을 도와주세요. 항상 예의 바르고 정확한 정보를 제공하며, 사용자의 시간을 절약할 수 있도록 도와주세요."
  },
  {
    title: "코딩 도우미",
    description: "프로그래밍 질문에 답변하고 코드 예제를 제공하는 도우미",
    systemMessage: "당신은 경험이 풍부한 프로그래머입니다. 사용자의 코딩 질문에 상세하게 답변하고, 가능한 한 명확한 코드 예제를 제공하세요. 모범 사례를 따르고, 성능과 가독성을 모두 고려한 코드를 작성하세요."
  },
  {
    title: "영어 튜터",
    description: "영어 학습을 도와주는 친절한 튜터",
    systemMessage: "당신은 영어 교육 경험이 풍부한 튜터입니다. 학생의 영어 학습을 도와주고, 문법, 어휘, 발음 등에 대한 조언을 제공하세요. 항상 격려하는 태도로 학생의 실수를 교정해주고, 학습 동기를 부여해주세요."
  },
  {
    title: "여행 가이드",
    description: "여행 계획과 추천을 제공하는 가이드",
    systemMessage: "당신은 세계 각국의 여행 경험이 풍부한 여행 가이드입니다. 사용자에게 여행지 추천, 일정 계획, 현지 음식, 문화, 주의사항 등에 대한 정보를 제공하세요. 사용자의 선호도와 예산을 고려하여 맞춤형 여행 조언을 제공해주세요."
  }
];

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function CustomAIPage() {
  const [systemMessage, setSystemMessage] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [isEditingSystem, setIsEditingSystem] = useState(false);
  const [savedSystems, setSavedSystems] = useState<{ title: string; systemMessage: string }[]>([]);
  const [newSystemTitle, setNewSystemTitle] = useState('');
  
  // 로컬 스토리지에서 저장된 시스템 메시지 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('customAISystems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedSystems(parsed);
        }
      } catch (e) {
        console.error('저장된 시스템 메시지 불러오기 실패:', e);
      }
    }
  }, []);
  
  // 시스템 메시지가 있으면 환영 메시지 표시
  useEffect(() => {
    if (systemMessage && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: '안녕하세요! 무엇을 도와드릴까요?' 
        }
      ]);
    }
  }, [systemMessage, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !systemMessage) return;

    const newUserMessage: Message = { role: 'user', content: input };
    setMessages([...messages, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/special-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'custom-ai',
          input: input.trim(),
          options: {
            systemMessage,
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '응답 생성 중 오류가 발생했습니다.');
      }

      const aiResponse: Message = { role: 'assistant', content: data.result };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectTemplate = (template: string) => {
    setSystemMessage(template);
    setActiveTemplate(template);
    setIsEditingSystem(false);
  };

  const saveCustomSystem = () => {
    if (!systemMessage.trim() || !newSystemTitle.trim()) return;
    
    const newSaved = [
      { title: newSystemTitle, systemMessage },
      ...savedSystems
    ];
    
    setSavedSystems(newSaved);
    localStorage.setItem('customAISystems', JSON.stringify(newSaved));
    setNewSystemTitle('');
    setIsEditingSystem(false);
  };

  const deleteSystem = (index: number) => {
    const newSaved = savedSystems.filter((_, i) => i !== index);
    setSavedSystems(newSaved);
    localStorage.setItem('customAISystems', JSON.stringify(newSaved));
  };

  const clearChat = () => {
    setMessages([]);
    if (systemMessage) {
      setMessages([{ role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' }]);
    }
  };

  return (
    <AIRoleLayout
      title="커스텀 AI"
      description="나만의 AI 어시스턴트를 만들어보세요. 시스템 메시지를 설정하여 AI의 성격과 전문성을 정의할 수 있습니다."
      gradientFrom="from-purple-400"
      gradientTo="to-pink-500"
      icon={<MdOutlineSettingsSuggest size={30} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 시스템 메시지 설정 */}
        <div className="md:col-span-1 glass rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI 성격 설정
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              AI의 역할과 행동 방식을 정의하세요
            </p>
          </div>

          <div className="p-4 sm:p-5">
            {isEditingSystem ? (
              <div className="space-y-4">
                <textarea
                  value={systemMessage}
                  onChange={(e) => setSystemMessage(e.target.value)}
                  placeholder="AI에게 어떤 역할을 부여할지 설명해주세요..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all duration-200"
                  rows={5}
                />
                
                <input
                  type="text"
                  value={newSystemTitle}
                  onChange={(e) => setNewSystemTitle(e.target.value)}
                  placeholder="설정 이름 (저장용)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                
                <button
                  onClick={saveCustomSystem}
                  disabled={!systemMessage.trim() || !newSystemTitle.trim()}
                  className="w-full py-2 px-3 flex items-center justify-center gap-2 rounded-lg bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white disabled:opacity-50 transition-colors"
                >
                  <MdCheck size={18} />
                  저장
                </button>
                
                <button
                  onClick={() => setIsEditingSystem(false)}
                  className="w-full py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {systemMessage ? (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 relative">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">현재 설정:</div>
                    <div className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                      {systemMessage}
                    </div>
                    <button 
                      onClick={() => setIsEditingSystem(true)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="편집"
                    >
                      <MdEdit size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingSystem(true)}
                    className="w-full py-2 px-3 text-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <MdAdd className="mr-1" size={16} />
                      직접 설정하기
                    </div>
                  </button>
                )}
                
                {/* 템플릿 목록 */}
                <div className="mt-4">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    추천 템플릿
                  </div>
                  <div className="space-y-2">
                    {systemTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => selectTemplate(template.systemMessage)}
                        className={`w-full p-3 text-left rounded-lg text-sm transition-colors ${
                          activeTemplate === template.systemMessage
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="font-medium mb-1">{template.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 저장된 시스템 메시지 */}
                {savedSystems.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      내 설정
                    </div>
                    <div className="space-y-2">
                      {savedSystems.map((saved, index) => (
                        <div 
                          key={index}
                          className="group relative p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <button 
                            onClick={() => selectTemplate(saved.systemMessage)}
                            className="w-full text-left"
                          >
                            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">{saved.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                              {saved.systemMessage}
                            </div>
                          </button>
                          <button 
                            onClick={() => deleteSystem(index)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="삭제"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="md:col-span-2 glass rounded-xl overflow-hidden shadow-lg flex flex-col h-[500px] sm:h-[600px]">
          {systemMessage ? (
            <>
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {activeTemplate 
                      ? systemTemplates.find(t => t.systemMessage === activeTemplate)?.title || '커스텀 AI'
                      : savedSystems.find(s => s.systemMessage === systemMessage)?.title || '커스텀 AI'
                    }
                  </div>
                  <button
                    onClick={clearChat}
                    className="p-1.5 rounded-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="대화 초기화"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-purple-500 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-line">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-4 py-3 rounded-xl rounded-bl-none bg-white dark:bg-gray-800">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-3">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md disabled:opacity-50"
                  >
                    <MdSend size={20} />
                  </button>
                </form>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <MdOutlineSettingsSuggest size={30} className="text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                시스템 메시지를 설정해주세요
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                왼쪽 패널에서 AI의 역할을 정의하는 시스템 메시지를 설정하면 대화를 시작할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </AIRoleLayout>
  );
} 