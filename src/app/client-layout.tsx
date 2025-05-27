"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { MdDarkMode, MdLightMode, MdMenu, MdClose } from "react-icons/md";

// Theme context for dark/light mode
type Theme = "light" | "dark";
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "light",
  setTheme: () => {},
});

// Navigation links for header
const navLinks = [
  { name: "홈", href: "/" },
  { name: "챗봇", href: "/chatbot" },
  { name: "특별 역할 AI", href: "/special-ai" },
  { name: "블로그 작성", href: "/blog-writer" },
  { name: "JSON AI", href: "/json-ai" },
];

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // On mount, set theme from localStorage or use dark as default
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Use dark mode as default
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const Header = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-lg">
      <div className="container-custom flex items-center justify-between py-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            Open Talk
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 hover:text-sky-500 dark:hover:text-sky-400"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <MdLightMode className="w-5 h-5" />
            ) : (
              <MdDarkMode className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 mr-2"
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <MdLightMode className="w-5 h-5" />
            ) : (
              <MdDarkMode className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200"
            aria-label="Menu"
          >
            {isOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden glass animate-slide-in-from-top duration-300">
          <nav className="container-custom py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="container-custom py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Open Talk. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://nextjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              Next.js
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
} 