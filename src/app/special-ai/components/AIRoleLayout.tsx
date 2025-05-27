"use client";
import React from 'react';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

interface AIRoleLayoutProps {
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AIRoleLayout: React.FC<AIRoleLayoutProps> = ({
  title,
  description,
  gradientFrom,
  gradientTo,
  icon,
  children,
}) => {
  return (
    <div className="w-full flex flex-col justify-start pt-6 md:pt-10 px-4 pb-8 sm:px-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/special-ai" 
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <MdArrowBack className="mr-1" />
            <span>다른 AI 보기</span>
          </Link>
        </div>

        <div className="glass p-6 md:p-8 rounded-xl mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientFrom} ${gradientTo}`}></div>
          
          <div className={`w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`}>
            {icon}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl md:text-2xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{description}</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AIRoleLayout; 