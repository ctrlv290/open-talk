"use client";
import React from "react";
import ChatUI from "./ChatUI";

export default function ChatbotPage() {
  return (
    <div className="w-full flex flex-col justify-start pt-8 md:pt-12 px-4 pb-8 sm:px-6">
      <div className="w-full max-w-md md:max-w-lg mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
          <span className="gradient-text">AI 챗봇</span>
        </h1>
        <ChatUI />
      </div>
    </div>
  );
}

// Test: Chatbot page should render heading and chat UI cleanly and centered. 