import Link from "next/link";
import { MdChat, MdPersonSearch, MdArticle, MdDataObject } from "react-icons/md";

// NOTE: Feature card icons use react-icons (Material Design)

const features = [
  {
    title: "챗봇",
    description: "OpenAI GPT와 1:1 대화형 챗봇",
    href: "/chatbot",
    icon: <MdChat size={24} className="text-sky-500 dark:text-sky-400" />,
  },
  {
    title: "특별 역할 AI",
    description: "프로그래밍, 번역, 상담 등 역할 기반 AI",
    href: "/special-ai",
    icon: <MdPersonSearch size={24} className="text-pink-400 dark:text-pink-300" />,
  },
  {
    title: "블로그 작성 AI",
    description: "키워드로 블로그 글 자동 생성",
    href: "/blog-writer",
    icon: <MdArticle size={24} className="text-purple-500 dark:text-purple-400" />,
  },
  {
    title: "JSON 데이터 AI",
    description: "JSON 응답을 구조화된 UI로 출력",
    href: "/json-ai",
    icon: <MdDataObject size={24} className="text-yellow-500 dark:text-yellow-400" />,
  },
];

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-start pt-16 md:pt-24 px-4 pb-8 sm:px-6">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          <span className="gradient-text">Open Talk</span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group glass p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-1 md:mb-2">
                {f.icon}
              </div>
              <div className="text-base md:text-lg font-semibold group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors duration-300">
                {f.title}
              </div>
              <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                {f.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Test: Main page should display 4 feature cards with correct titles and links.
