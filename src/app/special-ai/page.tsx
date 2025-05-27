"use client";
import React from "react";
import Link from "next/link";
import { 
  MdOutlineEmojiEmotions, 
  MdOutlineColorLens, 
  MdOutlineTranslate, 
  MdOutlineSettingsSuggest 
} from "react-icons/md";

const specialAIOptions = [
  {
    id: "emoji-generator",
    title: "이모지 생성기",
    description: "텍스트를 입력하면 텍스트에 맞는 이모지로 변환합니다",
    icon: <MdOutlineEmojiEmotions size={28} className="text-yellow-500 dark:text-yellow-400" />,
    gradientFrom: "from-yellow-400",
    gradientTo: "to-orange-500",
  },
  {
    id: "color-generator",
    title: "컬러 생성기",
    description: "텍스트 설명을 입력하면 어울리는 색상을 생성합니다",
    icon: <MdOutlineColorLens size={28} className="text-teal-500 dark:text-teal-400" />,
    gradientFrom: "from-teal-400",
    gradientTo: "to-emerald-500",
  },
  {
    id: "translator",
    title: "번역 앱",
    description: "한국어를 영어, 일본어, 중국어로 번역합니다",
    icon: <MdOutlineTranslate size={28} className="text-blue-500 dark:text-blue-400" />,
    gradientFrom: "from-blue-400",
    gradientTo: "to-indigo-500",
  },
  {
    id: "custom-ai",
    title: "커스텀 AI",
    description: "나만의 AI 시스템 메시지를 설정하여 사용해보세요",
    icon: <MdOutlineSettingsSuggest size={28} className="text-purple-500 dark:text-purple-400" />,
    gradientFrom: "from-purple-400",
    gradientTo: "to-pink-500",
  },
];

export default function SpecialAIPage() {
  return (
    <div className="w-full flex flex-col justify-start pt-8 md:pt-12 px-4 pb-8 sm:px-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="gradient-text">특별 역할 AI</span>
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
          다양한 특별 기능을 가진 AI 서비스를 이용해보세요. 각 AI는 고유한 역할에 최적화되어 있습니다.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 w-full">
          {specialAIOptions.map((option) => (
            <Link
              key={option.id}
              href={`/special-ai/${option.id}`}
              className="group glass p-5 md:p-6 flex flex-col items-center rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${option.gradientFrom} ${option.gradientTo}`}></div>
              
              <div className={`w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${option.gradientFrom} ${option.gradientTo} mb-4 text-white`}>
                {option.icon}
              </div>
              
              <div className="text-lg md:text-xl font-semibold group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-300 mb-2">
                {option.title}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {option.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 