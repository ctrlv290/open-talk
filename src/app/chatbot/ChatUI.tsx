"use client";
import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
// If you see a zod import error, run: npm install zod
import { MdSend, MdRefresh } from "react-icons/md";

// <SECURITY_REVIEW>
// - Validate input with zod before sending to API
// - Handle API/network errors gracefully
// - Prevent XSS by rendering plain text only
// </SECURITY_REVIEW>

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  { role: "assistant", content: "안녕하세요! 무엇을 도와드릴까요?" },
];

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const messagesSchema = z.array(messageSchema).min(1);

// Typing animation component
const TypingIndicator = () => (
  <div className="flex space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-3 bg-gray-200/70 dark:bg-gray-800/70 rounded-2xl rounded-bl-none w-fit">
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
  </div>
);

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input field
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input } as Message,
    ];
    // Validate messages before sending
    const safe = messagesSchema.safeParse(newMessages);
    if (!safe.success) {
      setError("입력값이 유효하지 않습니다.");
      return;
    }
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API 오류");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "(응답 없음)" } as Message,
      ]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "메시지 전송 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages(initialMessages);
    setError(null);
    inputRef.current?.focus();
  };

  // Handle enter key for sending
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex flex-col glass rounded-xl shadow-lg overflow-hidden h-[500px] sm:h-[550px] md:h-[600px]">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            AI 챗봇
          </h3>
          <button
            onClick={handleClear}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
            aria-label="대화 초기화"
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto scrollbar-hide p-3 sm:p-4 flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-900/50"
        aria-label="채팅 메시지 영역"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in animate-slide-in-from-bottom duration-300`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* AI avatar */}
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 mr-1 sm:mr-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 flex items-center justify-center text-white text-xs font-medium shadow-sm">
                  <span className="text-[10px] sm:text-xs">AI</span>
                </div>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`relative max-w-[75%] sm:max-w-[80%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm shadow-sm whitespace-pre-line break-words
                ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-700"
                }`
              }
              aria-label={msg.role === "user" ? "내 메시지" : "AI 메시지"}
            >
              {msg.content}
            </div>

            {/* User avatar */}
            {msg.role === "user" && (
              <div className="flex-shrink-0 ml-1 sm:ml-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium shadow-sm">
                  <span className="text-[10px] sm:text-xs">You</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start animate-fade-in animate-slide-in-from-bottom duration-300">
            <div className="flex-shrink-0 mr-1 sm:mr-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 flex items-center justify-center text-white text-xs font-medium shadow-sm">
                <span className="text-[10px] sm:text-xs">AI</span>
              </div>
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-xs text-center px-4 py-2 bg-red-50 dark:bg-red-900/20">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-2 sm:p-3">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          aria-label="메시지 입력 폼"
        >
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 overflow-hidden text-sm sm:text-base"
              placeholder="메시지를 입력하세요..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // 입력창 높이 자동 조절
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              aria-label="메시지 입력"
            />
          </div>
          <button
            type="submit"
            className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md hover:shadow-lg disabled:opacity-50 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 flex-shrink-0 disabled:hover:translate-y-0 flex items-center justify-center"
            disabled={isLoading || !input.trim()}
            aria-label="전송"
          >
            <MdSend size={18} className="sm:hidden" />
            <MdSend size={20} className="hidden sm:block" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;

// Test: ChatUI should look and behave like a modern messaging app with glass effects and animations. 